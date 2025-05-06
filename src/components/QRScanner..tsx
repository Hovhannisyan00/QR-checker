import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import styles from "./QRScanner.module.css";

const QRScanner = () => {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        );

        scanner.render(
            async (decodedText: string) => {
                if (isLoading) return; // Предотврати повтор
                setIsLoading(true);

                console.log("QR Code:", decodedText);

                try {
                    await fetch("https://your-backend.com/api/qr", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ code: decodedText }),
                    });
                } catch (err) {
                    console.error("Failed to send QR:", err);
                } finally {
                    scanner.clear();
                }
            },
            (error) => {
                console.warn("QR error:", error);
            }
        );

        return () => {
            scanner.clear().catch((e) => console.error("Clear failed:", e));
        };
    }, [isLoading]);

    return (
        <div className={styles.container}>
            <div className={styles.scannerBox}>
                <div id="qr-reader" className={styles.qrReader}></div>
                <div className={styles.scanLine}></div>
            </div>
            {isLoading && <div className={styles.loading}>Sending QR code...</div>}
        </div>
    );
};

export default QRScanner;
