import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import { triggerHaptic } from '../utils';

import { Language, TRANSLATIONS } from '../i18n';

interface QrScannerModalProps {
  language?: Language;
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (data: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({ language = 'kh', isOpen, onClose, onScanSuccess }) => {
  const t = TRANSLATIONS[language];
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scanError, setScanError] = useState<string>('');
  const [manualCode, setManualCode] = useState<string>('');

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animId: number | null = null;
    let isMounted = true;

    if (isOpen) {
      setScanError('');
      setManualCode('');

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      if (navigator.mediaDevices?.getUserMedia) {
        navigator.mediaDevices.getUserMedia(constraints)
          .then((s) => {
            if (!isMounted) {
              s.getTracks().forEach(t => t.stop());
              return;
            }
            stream = s;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.setAttribute('playsinline', 'true');
              videoRef.current.play().then(() => {
                if (isMounted) animId = requestAnimationFrame(tick);
              }).catch(() => {
                if (isMounted) setScanError('មិនអាចបើកកាមេរ៉ាបានទេ។ សូមវាយកូដផ្ទាល់ខាងក្រោម (Camera preview unavailable. Enter code manually below).');
              });
            }
          })
          .catch(() => {
            if (isMounted) setScanError('មិនទាន់អនុញ្ញាតកាមេរ៉ា ឬមិនមានកាមេរ៉ា។ សូមវាយកូដផ្ទាល់ខាងក្រោម (Camera permission required).');
          });
      } else {
        setScanError('កម្មវិធីរុករកនេះមិនគាំទ្រកាមេរ៉ាទេ។ សូមវាយបញ្ចូលកូដផ្ទាល់។');
      }
    }

    function tick() {
      if (!isMounted) return;
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (canvas) {
          const width = video.videoWidth;
          const height = video.videoHeight;
          if (width > 0 && height > 0) {
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (ctx) {
              ctx.drawImage(video, 0, 0, width, height);
              try {
                const imageData = ctx.getImageData(0, 0, width, height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                  inversionAttempts: 'attemptBoth',
                });
                if (code && code.data) {
                  triggerHaptic(60);
                  onScanSuccess(code.data.trim());
                  stopStream();
                  return;
                }
              } catch {
                // Ignore
              }
            }
          }
        }
      }
      if (isMounted) animId = requestAnimationFrame(tick);
    }

    function stopStream() {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (animId) {
        cancelAnimationFrame(animId);
      }
    }

    return () => {
      isMounted = false;
      stopStream();
    };
  }, [isOpen, onScanSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-4 text-center border border-slate-200">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
            <i className="fa-solid fa-qrcode text-sky-600"></i>
            <span>{t.scannerTitle}</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video sm:aspect-square flex items-center justify-center border-2 border-sky-500/50 shadow-inner">
          <video ref={videoRef} className="w-full h-full object-cover"></video>
          <canvas ref={canvasRef} className="hidden"></canvas>

          <div className="absolute inset-8 border-2 border-dashed border-sky-400/80 rounded-2xl pointer-events-none flex items-center justify-center">
            <div className="w-full h-0.5 bg-rose-500/80 animate-pulse"></div>
          </div>

          {scanError && (
            <div className="absolute inset-0 bg-slate-950/95 p-5 flex flex-col items-center justify-center text-center">
              <i className="fa-solid fa-triangle-exclamation text-amber-400 text-2xl mb-2"></i>
              <p className="text-xs text-white font-medium leading-relaxed">{scanError}</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-[11px] text-slate-500">
            {t.scannerPrompt}
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder={t.patientIdPlaceholder}
              className="flex-1 px-3 py-2 text-xs font-mono border rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              onClick={() => {
                if (manualCode.trim()) {
                  triggerHaptic(40);
                  onScanSuccess(manualCode.trim());
                }
              }}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
            >
              {language === 'kh' ? 'បញ្ចូល' : 'Apply'}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
        >
          {t.scannerCloseBtn}
        </button>
      </div>
    </div>
  );
};
