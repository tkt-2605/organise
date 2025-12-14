import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';

const Scanner = ({ onScan, onClose, fps = 10, qrbox = 250 }) => {
    const scannerRef = useRef(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Use Html5QrcodeScanner for a pre-built UI, or Html5Qrcode for custom UI
        // Here we use Html5QrcodeScanner for simplicity and reliability
        if (!scannerRef.current) return;

        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps, qrbox },
      /* verbose= */ false
        );

        scanner.render(
            (decodedText) => {
                onScan(decodedText);
                // Optional: Stop scanning after success if needed, but usually we let parent handle it
                // scanner.clear(); 
            },
            (errorMessage) => {
                // parse error, ignore it.
            }
        );

        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear html5-qrcode scanner. ", error);
            });
        };
    }, [onScan, fps, qrbox]);

    return (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
            >
                <X size={24} />
            </button>

            <div className="w-full max-w-sm bg-white rounded-xl overflow-hidden">
                <div id="reader" ref={scannerRef} className="w-full" />
            </div>

            <p className="mt-4 text-white/70 text-sm text-center">
                Point camera at a barcode or QR code
            </p>
        </div>
    );
};

export default Scanner;
