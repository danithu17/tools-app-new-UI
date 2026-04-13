"use client";

import { useState } from "react";

export default function DigitalSignaturesClient() {
  const [activeTab, setActiveTab] = useState<"sign" | "verify">("sign");
  const [data, setData] = useState("");
  const [signature, setSignature] = useState("");
  const [pubKeyStr, setPubKeyStr] = useState("");
  const [privKeyStr, setPrivKeyStr] = useState("");
  
  const [status, setStatus] = useState<string | null>(null);

  const generateKeys = async () => {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-PSS",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["sign", "verify"]
    );

    const pub = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
    const priv = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

    setPubKeyStr(btoa(String.fromCharCode(...new Uint8Array(pub))));
    setPrivKeyStr(btoa(String.fromCharCode(...new Uint8Array(priv))));
  };

  const handleSign = async () => {
    try {
      const privBuffer = Uint8Array.from(atob(privKeyStr), c => c.charCodeAt(0)).buffer;
      const key = await window.crypto.subtle.importKey(
        "pkcs8",
        privBuffer,
        { name: "RSA-PSS", hash: "SHA-256" },
        false,
        ["sign"]
      );

      const sig = await window.crypto.subtle.sign(
        { name: "RSA-PSS", saltLength: 32 },
        key,
        new TextEncoder().encode(data)
      );

      setSignature(btoa(String.fromCharCode(...new Uint8Array(sig))));
      setStatus("Successfully signed!");
    } catch (e) {
      setStatus("Error: Invalid Private Key");
    }
  };

  const handleVerify = async () => {
    try {
      const pubBuffer = Uint8Array.from(atob(pubKeyStr), c => c.charCodeAt(0)).buffer;
      const sigBuffer = Uint8Array.from(atob(signature), c => c.charCodeAt(0)).buffer;
      
      const key = await window.crypto.subtle.importKey(
        "spki",
        pubBuffer,
        { name: "RSA-PSS", hash: "SHA-256" },
        false,
        ["verify"]
      );

      const isValid = await window.crypto.subtle.verify(
        { name: "RSA-PSS", saltLength: 32 },
        key,
        sigBuffer,
        new TextEncoder().encode(data)
      );

      setStatus(isValid ? "✅ Signature is VALID" : "❌ Signature is INVALID");
    } catch (e) {
      setStatus("Error: Verification failed. Check key/signature format.");
    }
  };

  return (
    <div className="flex flex-col h-full gap-8">
      <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl w-full max-w-sm mx-auto">
        <button onClick={() => { setActiveTab("sign"); setStatus(null); }} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "sign" ? "bg-white dark:bg-slate-800 text-red-600 shadow-md" : "text-slate-500"}`}>🖋️ Sign</button>
        <button onClick={() => { setActiveTab("verify"); setStatus(null); }} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "verify" ? "bg-white dark:bg-slate-800 text-red-600 shadow-md" : "text-slate-500"}`}>✔️ Verify</button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 flex-1">
        <div className="flex flex-col gap-6">
           <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase text-slate-400">Step 1: The Content</label>
              <textarea 
                value={data} onChange={(e) => setData(e.target.value)}
                placeholder="Paste the text you want to sign or verify..."
                className="w-full h-40 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 outline-none focus:border-red-500 font-mono text-sm"
              />
           </div>

           {activeTab === "sign" ? (
             <div className="flex flex-col gap-4">
                <button onClick={generateKeys} className="text-xs font-bold text-red-500 hover:underline text-left ml-1">No Keys? Generate a New Pair</button>
                <div className="flex flex-col gap-2">
                   <label className="text-xs font-black uppercase text-slate-400">Private Key (Base64)</label>
                   <textarea value={privKeyStr} onChange={(e) => setPrivKeyStr(e.target.value)} className="w-full h-32 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/30 border border-slate-200 font-mono text-[10px]" />
                </div>
                <button onClick={handleSign} className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-red-600/20 transition-all hover:scale-[1.02]">Sign Content</button>
             </div>
           ) : (
             <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                   <label className="text-xs font-black uppercase text-slate-400">Public Key (Base64)</label>
                   <textarea value={pubKeyStr} onChange={(e) => setPubKeyStr(e.target.value)} className="w-full h-32 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/30 border border-slate-200 font-mono text-[10px]" />
                </div>
                <div className="flex flex-col gap-2">
                   <label className="text-xs font-black uppercase text-slate-400">Signature string</label>
                   <textarea value={signature} onChange={(e) => setSignature(e.target.value)} className="w-full h-24 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/30 border border-slate-200 font-mono text-[10px]" />
                </div>
                <button onClick={handleVerify} className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-lg shadow-xl transition-all hover:scale-[1.02]">Verify Signature</button>
             </div>
           )}
        </div>

        <div className="flex flex-col gap-6">
           <label className="text-xs font-black uppercase text-slate-400">Results & Keys</label>
           <div className="flex-1 rounded-[2rem] bg-slate-50 dark:bg-slate-950/20 border-4 border-dashed border-slate-100 dark:border-slate-800 p-8 flex flex-col gap-6">
              {status && (
                <div className={`p-4 rounded-xl font-bold text-center ${status.includes("✅") || status.includes("Successfully") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                  {status}
                </div>
              )}
              
              {activeTab === "sign" && signature && (
                <div className="flex flex-col gap-2">
                   <span className="text-[10px] font-black uppercase text-slate-400">Generated Signature</span>
                   <textarea readOnly value={signature} className="w-full h-32 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 font-mono text-[10px]" />
                </div>
              )}

              {privKeyStr && activeTab === "sign" && (
                <div className="flex flex-col gap-2">
                   <span className="text-[10px] font-black uppercase text-slate-400">Associated Public Key (Share this)</span>
                   <textarea readOnly value={pubKeyStr} className="w-full h-32 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 font-mono text-[10px]" />
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
