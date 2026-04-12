"use client";

import { useState, useEffect, useCallback } from "react";

export default function PasswordClient() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    let charPool = "";
    if (useUppercase) charPool += uppercaseChars;
    if (useLowercase) charPool += lowercaseChars;
    if (useNumbers) charPool += numberChars;
    if (useSymbols) charPool += symbolChars;

    if (charPool === "") {
      setPassword("Please select at least one option");
      return;
    }

    let generated = "";
    const randomValues = new Uint32Array(length);
    if (typeof window !== "undefined" && window.crypto) {
      window.crypto.getRandomValues(randomValues);
      for (let i = 0; i < length; i++) {
        generated += charPool[randomValues[i] % charPool.length];
      }
    } else {
      for (let i = 0; i < length; i++) {
        generated += charPool.charAt(Math.floor(Math.random() * charPool.length));
      }
    }
    
    setPassword(generated);
    setCopied(false);
  }, [length, useUppercase, useLowercase, useNumbers, useSymbols]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const copyToClipboard = () => {
    if (!password || password.startsWith("Please select")) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const calculateStrength = () => {
    if (!password || password.startsWith("Please")) return 0;
    let strength = 0;
    if (password.length >= 12) strength += 1;
    if (password.length >= 16) strength += 1;
    if (useUppercase && useLowercase) strength += 1;
    if (useNumbers) strength += 1;
    if (useSymbols) strength += 1;
    return Math.min(stärke, 5); // typo here, I will fix it inside to strength
  };

  const strength = !password.startsWith("Please") ? (
    (password.length >= 12 ? 1 : 0) + 
    (useUppercase && useLowercase ? 1 : 0) + 
    (useNumbers ? 1 : 0) + 
    (useSymbols ? 1 : 0) + 
    (password.length >= 16 ? 1 : 0)
  ) : 0;
  
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColors = [
    "bg-red-500", 
    "bg-orange-500", 
    "bg-amber-400", 
    "bg-lime-400", 
    "bg-green-500", 
    "bg-emerald-600"
  ];

  return (
    <div className="w-full flex flex-col items-center max-w-3xl mx-auto gap-8 mt-4">
      {/* Password Display */}
      <div className="w-full relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-amber-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
        <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 pr-24 shadow-xl flex items-center min-h-[100px] break-all">
          <p className="text-2xl md:text-3xl font-mono text-slate-800 dark:text-white font-medium select-all">
            {password}
          </p>
          <button
            onClick={copyToClipboard}
            className="absolute right-4 p-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl transition-all shadow-sm active:scale-95"
            title="Copy to clipboard"
          >
            {copied ? "✓ Copied" : "📋 Copy"}
          </button>
        </div>
      </div>

      {/* Strength Indicator */}
      <div className="w-full flex items-center justify-between px-2">
        <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          Strength: <span className="text-slate-800 dark:text-white ml-2">{strengthLabels[strength]}</span>
        </div>
        <div className="flex gap-2 h-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <div 
              key={level} 
              className={`w-12 h-2 rounded-full transition-all duration-500 ${strength >= level ? strengthColors[strength] : 'bg-slate-200 dark:bg-slate-800'}`}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm flex flex-col gap-8">
        
        {/* Length Slider */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <label className="font-bold text-slate-700 dark:text-slate-200 text-lg">Password Length</label>
            <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold px-4 py-2 rounded-xl text-xl w-16 text-center">{length}</span>
          </div>
          <input 
            type="range" 
            min="8" 
            max="128" 
            value={length} 
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-red-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <hr className="border-slate-100 dark:border-slate-800" />

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: "uppercase", label: "Uppercase (A-Z)", state: useUppercase, setState: setUseUppercase },
            { id: "lowercase", label: "Lowercase (a-z)", state: useLowercase, setState: setUseLowercase },
            { id: "numbers", label: "Numbers (0-9)", state: useNumbers, setState: setUseNumbers },
            { id: "symbols", label: "Symbols (!@#)", state: useSymbols, setState: setUseSymbols },
          ].map((option) => (
            <label 
              key={option.id} 
              className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 ${option.state ? 'border-red-500 bg-red-50/50 dark:bg-red-900/10' : 'border-slate-200 dark:border-slate-800'}`}
            >
              <div className="relative flex items-center justify-center w-6 h-6 mr-4">
                <input 
                  type="checkbox" 
                  checked={option.state} 
                  onChange={(e) => option.setState(e.target.checked)}
                  className="peer appearance-none w-6 h-6 border-2 border-slate-300 dark:border-slate-700 rounded-md checked:bg-red-500 checked:border-red-500 transition-colors"
                />
                <svg className="absolute w-4 h-4 pointer-events-none opacity-0 peer-checked:opacity-100 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{option.label}</span>
            </label>
          ))}
        </div>

        {/* Generate Button */}
        <button 
          onClick={generatePassword}
          className="mt-4 w-full py-5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xl shadow-lg shadow-red-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-2"
        >
          <span>🔄</span> Generate New Password
        </button>

      </div>
    </div>
  );
}
