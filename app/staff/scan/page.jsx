'use client';

import { useState, useEffect, useRef } from 'react';
import { QrCode, X, CheckCircle2, XCircle, Camera } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

function ScanResult({ result, onClose }) {
  if (!result) return null;
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60`}>
      <div className={`w-full max-w-sm rounded-2xl p-8 text-center ${result.valid ? 'bg-white' : 'bg-white'}`}>
        {result.valid ? (
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        ) : (
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        )}
        <h3 className={`text-xl font-extrabold mb-2 ${result.valid ? 'text-green-700' : 'text-red-700'}`}>
          {result.valid ? '✅ Valid Ticket' : '❌ Invalid Ticket'}
        </h3>
        <p className="text-gray-600 text-sm mb-1">{result.message}</p>
        {result.token && (
          <p className="font-mono text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2 mt-2 break-all">{result.token}</p>
        )}
        <Button className="w-full mt-6" onClick={onClose} variant={result.valid ? 'success' : 'danger'}>
          Scan Next Ticket
        </Button>
      </div>
    </div>
  );
}

export default function StaffScanPage() {
  const [scanMode,  setScanMode]  = useState(false);
  const [result,    setResult]    = useState(null);
  const [manualToken, setManualToken] = useState('');
  const [scanlog,   setScanLog]   = useState([]);
  const scannerRef = useRef(null);
  const scannerInstance = useRef(null);

  const validateToken = async (raw) => {
    let token = raw.trim();
    try { const obj = JSON.parse(raw); token = obj.token || raw; } catch {}
    try {
      const res = await api.post('/scan', { token });
      if (res.data.valid) {
        const t = res.data.ticket || {};
        const detail = [t.attendeeName, t.eventTitle, t.ticketType].filter(Boolean).join(' · ');
        return { valid: true, token, message: `Entry granted!${detail ? ` — ${detail}` : ''}`, attendee: t.attendeeName };
      }
      return { valid: false, token, message: res.data.message || 'Invalid ticket.' };
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Scan failed. Try again.';
      return { valid: false, token, message: msg };
    }
  };

  const handleScanResult = async (decodedText) => {
    if (scannerInstance.current) {
      scannerInstance.current.stop().catch(() => {});
    }
    const res = await validateToken(decodedText);
    setResult(res);
    setScanMode(false);
    setScanLog((prev) => [
      { ...res, ts: new Date().toLocaleTimeString(), id: Date.now() },
      ...prev.slice(0, 19),
    ]);
  };

  const startCamera = async () => {
    setScanMode(true);
    setResult(null);

    // Lazy-load html5-qrcode only in browser
    try {
      const { Html5QrcodeScanner } = await import('html5-qrcode');
      setTimeout(() => {
        if (!document.getElementById('qr-reader')) return;
        const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: 250 }, false);
        scanner.render(
          (decoded) => handleScanResult(decoded),
          (err)     => { /* ignore scan errors */ }
        );
        scannerInstance.current = scanner;
      }, 300);
    } catch {
      setScanMode(false);
      toast.error('Camera scan not supported in this environment. Use manual entry below.');
    }
  };

  const stopCamera = () => {
    if (scannerInstance.current) {
      scannerInstance.current.stop().catch(() => {});
      scannerInstance.current = null;
    }
    setScanMode(false);
  };

  const handleManualCheck = async () => {
    if (!manualToken.trim()) return;
    const res = await validateToken(manualToken);
    setResult(res);
    setManualToken('');
    setScanLog((prev) => [
      { ...res, ts: new Date().toLocaleTimeString(), id: Date.now() },
      ...prev.slice(0, 19),
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-lg mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-7 h-7 text-brand-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Ticket Scanner</h1>
          <p className="text-gray-500 text-sm mt-1">Scan or enter ticket QR tokens to validate entry</p>
        </div>

        {/* Camera Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
          {!scanMode ? (
            <Button className="w-full" size="lg" onClick={startCamera}>
              <Camera className="w-5 h-5" /> Start Camera Scan
            </Button>
          ) : (
            <div className="space-y-3">
              <div id="qr-reader" ref={scannerRef} className="w-full rounded-xl overflow-hidden" />
              <Button variant="outline" className="w-full" onClick={stopCamera}>
                <X className="w-4 h-4" /> Stop Scanner
              </Button>
            </div>
          )}
        </div>

        {/* Manual Entry */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
          <h3 className="font-bold text-gray-900 mb-3 text-sm">Manual Token Entry</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Paste ticket token here…"
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleManualCheck()}
              className="input-field flex-1 font-mono text-sm"
            />
            <Button onClick={handleManualCheck} disabled={!manualToken.trim()}>Check</Button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Enter the ticket QR token or scan with camera above.
          </p>
        </div>

        {/* Scan Log */}
        {scanlog.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Scan History (this session)</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {scanlog.map((log) => (
                <div key={log.id} className={`flex items-center gap-3 p-2.5 rounded-xl text-sm ${
                  log.valid ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  {log.valid
                    ? <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                    : <XCircle      className="w-4 h-4 text-red-500   shrink-0" />
                  }
                  <span className="font-mono text-xs truncate flex-1">{log.token}</span>
                  <span className="text-xs text-gray-400 shrink-0">{log.ts}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Result overlay */}
      {result && <ScanResult result={result} onClose={() => setResult(null)} />}
    </div>
  );
}
