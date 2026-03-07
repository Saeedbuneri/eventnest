'use client';

import { useState, useEffect, useRef } from 'react';
import { QrCode, X, CheckCircle2, XCircle, Camera, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

//  Permission states 
const PERM = { IDLE: 'idle', REQUESTING: 'requesting', DENIED: 'denied' };

//  Scan Result Overlay 
function ScanResult({ result, onClose }) {
  if (!result) return null;
  const ok = result.valid;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
      <div className={`w-full max-w-sm rounded-3xl p-8 text-center border shadow-2xl ${ok ? 'bg-[#091409] border-green-500/30 shadow-[0_0_80px_rgba(34,197,94,.12)]' : 'bg-[#140909] border-red-500/30 shadow-[0_0_80px_rgba(239,68,68,.12)]'}`}>
        <div className={`w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center ${ok ? 'bg-green-500/10 ring-2 ring-green-500/25 shadow-[0_0_32px_rgba(34,197,94,.2)]' : 'bg-red-500/10 ring-2 ring-red-500/25 shadow-[0_0_32px_rgba(239,68,68,.2)]'}`}>
          {ok ? <CheckCircle2 className="w-10 h-10 text-green-400" /> : <XCircle className="w-10 h-10 text-red-400" />}
        </div>
        <h3 className={`text-2xl font-extrabold mb-2 ${ok ? 'text-green-400' : 'text-red-400'}`}>
          {ok ? 'Valid Ticket' : 'Invalid Ticket'}
        </h3>
        <p className="text-gray-400 text-sm mb-1">{result.message}</p>
        {result.token && (
          <p className="font-mono text-xs text-gray-500 bg-white/5 rounded-xl px-3 py-2.5 mt-3 break-all border border-white/10">{result.token}</p>
        )}
        <button onClick={onClose} className={`w-full mt-6 py-3.5 rounded-xl font-bold text-sm transition-all ${ok ? 'bg-green-500/15 hover:bg-green-500/25 text-green-400 border border-green-500/25' : 'bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/25'}`}>
          Scan Next Ticket
        </button>
      </div>
    </div>
  );
}

//  Main page 
export default function StaffScanPage() {
  const [scanMode,    setScanMode]    = useState(false);
  const [result,      setResult]      = useState(null);
  const [manualToken, setManualToken] = useState('');
  const [scanlog,     setScanLog]     = useState([]);
  const [permState,   setPermState]   = useState(PERM.IDLE);
  const scannerInstance = useRef(null);

  useEffect(() => {
    return () => {
      if (scannerInstance.current) scannerInstance.current.stop().catch(() => {});
    };
  }, []);

  const validateToken = async (raw) => {
    let token = raw.trim();
    try { const obj = JSON.parse(raw); token = obj.token || raw; } catch {}
    try {
      const res = await api.post('/scan', { token });
      if (res.data.valid) {
        const t = res.data.ticket || {};
        const detail = [t.attendeeName, t.eventTitle, t.ticketType].filter(Boolean).join('  ');
        return { valid: true, token, message: `Entry granted!${detail ? `  ${detail}` : ''}` };
      }
      return { valid: false, token, message: res.data.message || 'Invalid ticket.' };
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Scan failed. Try again.';
      return { valid: false, token, message: msg };
    }
  };

  const handleScanResult = async (decodedText) => {
    if (scannerInstance.current) scannerInstance.current.stop().catch(() => {});
    const res = await validateToken(decodedText);
    setResult(res);
    setScanMode(false);
    setPermState(PERM.IDLE);
    setScanLog((prev) => [{ ...res, ts: new Date().toLocaleTimeString(), id: Date.now() }, ...prev.slice(0, 19)]);
  };

  const startCamera = async () => {
    setPermState(PERM.REQUESTING);
    setResult(null);

    // 1. Explicitly request camera permission
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      stream.getTracks().forEach((t) => t.stop());
    } catch {
      setPermState(PERM.DENIED);
      toast.error('Camera access denied. Allow camera in browser settings and retry.');
      return;
    }

    // 2. Launch QR scanner
    setScanMode(true);
    setPermState(PERM.IDLE);
    try {
      const { Html5QrcodeScanner } = await import('html5-qrcode');
      setTimeout(() => {
        if (!document.getElementById('qr-reader')) return;
        const scanner = new Html5QrcodeScanner('qr-reader', { fps: 15, qrbox: { width: 240, height: 240 }, showTorchButtonIfSupported: true }, false);
        scanner.render((decoded) => handleScanResult(decoded), () => {});
        scannerInstance.current = scanner;
      }, 300);
    } catch {
      setScanMode(false);
      setPermState(PERM.IDLE);
      toast.error('QR scanner failed to load. Use manual token entry below.');
    }
  };

  const stopCamera = () => {
    if (scannerInstance.current) { scannerInstance.current.stop().catch(() => {}); scannerInstance.current = null; }
    setScanMode(false);
    setPermState(PERM.IDLE);
  };

  const handleManualCheck = async () => {
    if (!manualToken.trim()) return;
    const res = await validateToken(manualToken);
    setResult(res);
    setManualToken('');
    setScanLog((prev) => [{ ...res, ts: new Date().toLocaleTimeString(), id: Date.now() }, ...prev.slice(0, 19)]);
  };

  return (
    <div className="min-h-screen bg-[#07070e]">
      <Navbar />

      {/* Ambient glow background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-brand-600/[0.05] blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full bg-violet-600/[0.04] blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.018]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
      </div>

      <div className="relative max-w-lg mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-5 bg-brand-600/10 border border-brand-500/20 shadow-[0_0_40px_rgba(225,29,72,.15)] glow-pulse">
            <QrCode className="w-8 h-8 text-brand-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1.5">Ticket Scanner</h1>
          <p className="text-gray-500 text-sm">Scan QR codes or enter tokens to validate entry</p>
        </div>

        {/* Camera Section */}
        <div className="surface-3d rounded-2xl border border-white/[0.07] p-5 mb-4 shadow-[0_8px_40px_rgba(0,0,0,.45)]">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.18em] mb-4">Camera Scanner</p>

          {permState === PERM.DENIED && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-400">Camera access denied</p>
                <p className="text-xs text-red-400/60 mt-0.5">Browser settings  Site permissions  Camera  Allow, then retry.</p>
              </div>
            </div>
          )}

          {!scanMode ? (
            <button
              onClick={startCamera}
              disabled={permState === PERM.REQUESTING}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-sm bg-brand-600 hover:bg-brand-500 disabled:opacity-60 disabled:cursor-wait text-white transition-all btn-3d"
            >
              {permState === PERM.REQUESTING ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Requesting Camera</>
              ) : (
                <><Camera className="w-5 h-5" /> Start Camera Scan</>
              )}
            </button>
          ) : (
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden bg-black ring-1 ring-white/10">
                <div id="qr-reader" className="w-full" />
                {/* Animated scan line */}
                <div className="absolute inset-x-8 pointer-events-none" style={{ top: '50%' }}>
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-brand-400 to-transparent opacity-90 animate-scan" />
                </div>
                {/* Corner brackets */}
                <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-brand-400/60 rounded-tl pointer-events-none" />
                <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-brand-400/60 rounded-tr pointer-events-none" />
                <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-brand-400/60 rounded-bl pointer-events-none" />
                <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-brand-400/60 rounded-br pointer-events-none" />
              </div>
              <button
                onClick={stopCamera}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border border-white/10 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all"
              >
                <X className="w-4 h-4" /> Stop Scanner
              </button>
            </div>
          )}
        </div>

        {/* Manual Entry */}
        <div className="surface-3d rounded-2xl border border-white/[0.07] p-5 mb-4 shadow-[0_8px_40px_rgba(0,0,0,.45)]">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.18em] mb-4">Manual Token Entry</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Paste ticket token here"
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleManualCheck()}
              className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 transition-all"
            />
            <button
              onClick={handleManualCheck}
              disabled={!manualToken.trim()}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white font-bold text-sm transition-all btn-3d shrink-0"
            >
              Check
            </button>
          </div>
          <p className="text-xs text-gray-700 mt-2">Enter the QR token or scan with camera above.</p>
        </div>

        {/* Scan Log */}
        {scanlog.length > 0 && (
          <div className="surface-3d rounded-2xl border border-white/[0.07] p-5 shadow-[0_8px_40px_rgba(0,0,0,.45)]">
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.18em] mb-4">
              Session Log <span className="text-brand-500 normal-case ml-1">{scanlog.length}</span>
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {scanlog.map((log) => (
                <div key={log.id} className={`flex items-center gap-3 p-3 rounded-xl text-sm border transition-all ${log.valid ? 'bg-green-500/[0.06] border-green-500/20 hover:bg-green-500/[0.1]' : 'bg-red-500/[0.06] border-red-500/20 hover:bg-red-500/[0.1]'}`}>
                  {log.valid ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> : <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                  <span className="font-mono text-xs truncate flex-1 text-gray-300">{log.token}</span>
                  <span className="text-xs text-gray-600 shrink-0">{log.ts}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {result && <ScanResult result={result} onClose={() => setResult(null)} />}
    </div>
  );
}