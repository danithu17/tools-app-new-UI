"use client";

import { useState } from "react";

export default function SshKeyGenClient() {
  const [keys, setKeys] = useState<{ public: string; private: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<"pub" | "priv" | null>(null);

  const generateKeys = async () => {
    setLoading(true);
    try {
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 4096,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
      );

      const exportedPub = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
      const exportedPriv = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

      const pubBase64 = btoa(String.fromCharCode(...new Uint8Array(exportedPub)));
      const privBase64 = btoa(String.fromCharCode(...new Uint8Array(exportedPriv)));

      setKeys({
        public: `-----BEGIN PUBLIC KEY-----\n${formatBase64(pubBase64)}\n-----END PUBLIC KEY-----`,
        private: `-----BEGIN PRIVATE KEY-----\n${formatBase64(privBase64)}\n-----END PRIVATE KEY-----`,
      });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const formatBase64 = (str: string) => {
    return str.match(/.{1,64}/g)?.join("\n") || str;
  };

  const copy = (text: string, type: "pub" | "priv") => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-col items-center justify-center py-6 bg-slate-50 dark:bg-slate-950/20 rounded-[2rem] border border-slate-200 dark:border-slate-800">
        <button
          onClick={generateKeys}
          disabled={loading}
          className="px-10 py-5 bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white rounded-2xl font-black text-xl shadow-xl shadow-red-600/20 transition-all hover:scale-105 active:scale-95"
        >
          {loading ? "⚙️ Generating..." : "Generate RSA-4096 Key Pair"}
        </button>
        <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
          High Entropy Local Generation
        </p>
      </div>

      {keys && (
        <div className="grid md:grid-cols-2 gap-6 flex-1 min-h-0">
          <div className="flex flex-col gap-2 min-h-0">
            <div className="flex items-center justify-between mx-1">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Public Key</label>
              <button 
                onClick={() => copy(keys.public, "pub")}
                className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
              >
                {copied === "pub" ? "✓ Copied" : "Copy Pubkey"}
              </button>
            </div>
            <textarea
              readOnly
              value={keys.public}
              className="flex-1 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 font-mono text-[10px] outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="flex flex-col gap-2 min-h-0">
            <div className="flex items-center justify-between mx-1">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Private Key</label>
              <button 
                onClick={() => copy(keys.private, "priv")}
                className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
              >
                {copied === "priv" ? "✓ Copied" : "Copy Private Key"}
              </button>
            </div>
            <div className="flex-1 relative group">
              <textarea
                readOnly
                value={keys.private}
                className="w-full h-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 font-mono text-[10px] outline-none resize-none leading-relaxed blur-sm hover:blur-none transition-all duration-300"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                 <span className="bg-slate-900 text-white px-3 py-1 rounded-lg text-[10px] font-bold">Hover to Reveal</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!keys && !loading && (
        <div className="flex-1 flex flex-col items-center justify-center opacity-30">
          <div className="text-6xl mb-4">🔑</div>
          <p className="font-bold text-slate-500">Your keys will be generated securely in your RAM</p>
        </div>
      )}
    </div>
  );
}
