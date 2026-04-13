"use client";

import { useState, useRef } from "react";

export default function FileEncryptorClient() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const deriveKey = async (password: string, salt: Uint8Array) => {
    const encoder = new TextEncoder();
    const passwordKey = await window.crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveBits", "deriveKey"]
    );

    return window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      passwordKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  };

  const handleProcess = async () => {
    if (!file || !password) return;
    setStatus("processing");
    setErrorMessage("");

    try {
      const fileBuffer = await file.arrayBuffer();
      
      if (mode === "encrypt") {
        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const key = await deriveKey(password, salt);

        const encrypted = await window.crypto.subtle.encrypt(
          { name: "AES-GCM", iv },
          key,
          fileBuffer
        );

        // Result format: SALT (16) + IV (12) + DATA
        const result = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
        result.set(salt, 0);
        result.set(iv, salt.length);
        result.set(new Uint8Array(encrypted), salt.length + iv.length);

        downloadFile(result, `${file.name}.enc`);
      } else {
        const data = new Uint8Array(fileBuffer);
        const salt = data.slice(0, 16);
        const iv = data.slice(16, 28);
        const encrypted = data.slice(28);
        const key = await deriveKey(password, salt);

        try {
          const decrypted = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            key,
            encrypted
          );
          downloadFile(new Uint8Array(decrypted), file.name.replace(".enc", ""));
        } catch (e) {
          throw new Error("Wrong password or corrupted file.");
        }
      }
      setStatus("done");
    } catch (e: any) {
      setErrorMessage(e.message);
      setStatus("error");
    }
  };

  const downloadFile = (data: Uint8Array, name: string) => {
    const blob = new Blob([data]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full gap-8">
      <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl w-full max-w-sm mx-auto shadow-inner">
        <button 
          onClick={() => setMode("encrypt")}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${mode === "encrypt" ? "bg-white dark:bg-slate-800 text-red-600 shadow-md" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
        >
          🔒 Encrypt
        </button>
        <button 
          onClick={() => setMode("decrypt")}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${mode === "decrypt" ? "bg-white dark:bg-slate-800 text-red-600 shadow-md" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
        >
          🔓 Decrypt
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
              Select {mode === "encrypt" ? "any file" : ".enc file"}
            </label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group cursor-pointer aspect-video md:aspect-[4/3] rounded-[2.5rem] border-4 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-4 hover:border-red-500/50 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-all"
            >
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white transition-all shadow-sm">
                📁
              </div>
              <div className="text-center px-4">
                <p className="font-bold text-slate-700 dark:text-slate-300">
                  {file ? file.name : "Choose or drop file"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "No size limit"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 pt-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters recommended"
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 font-bold outline-none focus:border-red-500 shadow-sm"
            />
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-2xl border border-red-100 dark:border-red-900/40">
            <p className="text-xs leading-relaxed text-red-800 dark:text-red-300 font-medium">
              <span className="font-bold">⚠️ Warning:</span> We don't save your password. If you lose it, the file cannot be decrypted. Everything happens in your RAM and is never uploaded.
            </p>
          </div>

          <button
            disabled={!file || !password || status === "processing"}
            onClick={handleProcess}
            className={`w-full py-5 rounded-2xl font-black text-xl transition-all shadow-xl ${
              !file || !password || status === "processing"
                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed grayscale"
                : "bg-red-600 hover:bg-red-700 text-white hover:scale-[1.02] active:scale-95 shadow-red-600/20"
            }`}
          >
            {status === "processing" ? "🔒 Processing..." : mode === "encrypt" ? "Securely Encrypt" : "Securely Decrypt"}
          </button>

          {status === "error" && (
            <div className="p-4 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-900/60 rounded-xl text-orange-700 dark:text-orange-400 font-bold text-sm text-center">
              ❌ {errorMessage}
            </div>
          )}

          {status === "done" && (
            <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-900/60 rounded-xl text-green-700 dark:text-green-400 font-bold text-sm text-center">
              ✨ Success! Your file is ready.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
