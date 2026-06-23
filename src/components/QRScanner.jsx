"use client";

import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QRScanner({ onScan, onClose }) {
  const scannerRef = useRef(null);

  useEffect(() => {
    // Prevent multiple initializations in React strict mode
    if (!scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
        /* verbose= */ false
      );

      scanner.render(
        (decodedText) => {
          // Attempt to parse Ethereum address
          let address = decodedText;
          if (decodedText.startsWith("ethereum:")) {
            address = decodedText.split("ethereum:")[1].split("@")[0].split("?")[0];
          }
          onScan(address);
          scanner.clear();
        },
        (error) => {
          // Ignore scanning errors (happens constantly while waiting for a QR code)
        }
      );

      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, [onScan]);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "400px", background: "white", padding: "1rem", borderRadius: "1rem" }}>
        <h3 style={{ textAlign: "center", marginBottom: "1rem", color: "#000" }}>Scan QR Code</h3>
        <div id="reader" style={{ width: "100%" }}></div>
        <button 
          onClick={onClose}
          style={{ width: "100%", padding: "1rem", marginTop: "1rem", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "0.5rem", fontWeight: "bold", cursor: "pointer" }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
