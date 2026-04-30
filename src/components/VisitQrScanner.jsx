import { useEffect, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const stopScanner = async (scanner) => {
  if (!scanner) return;
  try {
    const state = scanner.getState();
    if (
      state === Html5QrcodeScannerState.SCANNING ||
      state === Html5QrcodeScannerState.PAUSED
    ) {
      await scanner.stop();
      console.log('[QR] scanner stopped');
    }
  } catch (e) {
    console.warn('[QR] stop error (ignored):', e?.message);
  }
  try {
    scanner.clear();
  } catch {
    /* ignore */
  }
};

/** Wait until the container has a real width (max ~3 s). */
const waitForElement = (id) =>
  new Promise((resolve) => {
    const deadline = Date.now() + 3000;
    const tick = () => {
      const el = document.getElementById(id);
      if (el && el.clientWidth > 0) return resolve(el);
      if (Date.now() > deadline) return resolve(null);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

/** Build video constraints that favour the rear camera.
 *  Uses `ideal` (not `exact`) so iOS doesn't throw OverconstrainedError. */
const rearCameraConstraints = {
  facingMode: { ideal: 'environment' },
  width: { ideal: 1280 },
  height: { ideal: 720 },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Renders a live camera QR scanner.
 *
 * Props
 *   readerId  – unique DOM id for the container div
 *   active    – when true the camera starts; when false/unmounted it stops
 *   onDecoded – called once with the raw decoded string on first successful scan
 */
const VisitQrScanner = ({ readerId, active, onDecoded }) => {
  const onDecodedRef = useRef(onDecoded);
  const scannerRef  = useRef(null);
  const doneRef     = useRef(false); // prevents double-firing after stop

  useEffect(() => { onDecodedRef.current = onDecoded; }, [onDecoded]);

  useEffect(() => {
    if (!active || !readerId) return;

    doneRef.current = false;
    let cancelled   = false;

    const run = async () => {
      // 1. Wait for the DOM element to have real dimensions
      const el = await waitForElement(readerId);
      if (!el) {
        console.error('[QR] container not found or has zero width:', readerId);
        return;
      }
      if (cancelled) return;
      console.log('[QR] container ready, starting scanner on', readerId);

      // 2. Create scanner instance
      //    – NO experimentalFeatures: BarcodeDetector is unreliable on iOS Safari
      //    – verbose: false suppresses the per-frame "QR not found" spam
      const scanner = new Html5Qrcode(readerId, { verbose: false });
      scannerRef.current = scanner;

      // 3. Scanner config
      //    – Fixed 250×250 qrbox: dynamic sizing can confuse the decoder
      //    – disableFlip: false: some cameras/QR orientations need mirror check
      //    – fps 10: stable; higher fps does not improve detection, wastes CPU
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        disableFlip: false,
      };

      // 4. Success callback – fires on every decoded frame while scanning
      const onSuccess = (decodedText) => {
        if (doneRef.current || cancelled) return;
        doneRef.current = true;
        console.log('[QR] decoded:', decodedText);

        // Stop the scanner immediately so it doesn't keep firing
        stopScanner(scanner).finally(() => {
          if (scannerRef.current === scanner) scannerRef.current = null;
        });

        onDecodedRef.current?.(decodedText);
      };

      // 5. Error callback – called on every frame where no QR is found.
      //    We only log actual errors, not the normal "not found" noise.
      const onError = (err) => {
        if (typeof err === 'string' && err.includes('No MultiFormat Readers')) return;
        if (typeof err === 'string' && err.includes('NotFoundException')) return;
        console.warn('[QR] scan error:', err);
      };

      // 6. Try rear camera first (best on mobile), fall back if unavailable
      const tryStart = async () => {
        // Attempt 1: enumerate cameras and pick a rear one by label
        try {
          const cameras = await Html5Qrcode.getCameras();
          console.log('[QR] available cameras:', cameras.map((c) => c.label));
          const rear = cameras.find((c) =>
            /back|rear|environment|wide/i.test(c.label || '')
          );
          const cam = rear ?? cameras[0];
          if (cam) {
            console.log('[QR] starting with camera id:', cam.label || cam.id);
            await scanner.start(cam.id, config, onSuccess, onError);
            return; // success
          }
        } catch (e) {
          console.warn('[QR] getCameras / start by id failed:', e?.message);
          if (cancelled) return;
        }

        // Attempt 2: facingMode: { ideal: 'environment' } – works on most mobiles
        //            `ideal` never throws OverconstrainedError (unlike `exact`)
        try {
          console.log('[QR] trying facingMode ideal:environment');
          await scanner.start(
            { facingMode: { ideal: 'environment' } },
            { ...config, videoConstraints: rearCameraConstraints },
            onSuccess,
            onError
          );
          return;
        } catch (e) {
          console.warn('[QR] environment facingMode failed:', e?.message);
          if (cancelled) return;
        }

        // Attempt 3: any camera (front / laptop webcam)
        try {
          console.log('[QR] falling back to user facingMode');
          await scanner.start(
            { facingMode: 'user' },
            config,
            onSuccess,
            onError
          );
        } catch (e) {
          console.error('[QR] all camera attempts failed:', e?.message);
        }
      };

      await tryStart();

      if (cancelled) {
        stopScanner(scanner);
        if (scannerRef.current === scanner) scannerRef.current = null;
      }
    };

    run();

    return () => {
      cancelled = true;
      const s = scannerRef.current;
      scannerRef.current = null;
      stopScanner(s);
    };
  }, [active, readerId]);

  return (
    <div
      id={readerId}
      className="w-full min-h-[260px] rounded-2xl overflow-hidden bg-slate-900"
    />
  );
};

export default VisitQrScanner;
