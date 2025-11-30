import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Upload, X, ScanEye, CheckCircle2, AlertTriangle, Loader2, AlertCircle, LogOut } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Modern Toast
const Toast = ({ message, onClose }) => (
  <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slideDown">
    <div className="bg-red-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[340px] backdrop-blur-xl border border-red-500/50">
      <AlertCircle size={22} />
      <p className="font-medium">{message}</p>
      <button onClick={onClose} className="ml-auto hover:bg-white/20 rounded-full p-1 transition">
        <X size={18} />
      </button>
    </div>
  </div>
);

// Result Alert
const ResultAlert = ({ result, preview, onClose }) => {
  const isFake = result.prediction === "AI Generated";
  const isReal = result.prediction === "Real";
  const isOther = result.prediction === "Other Image";

  const statusColor = isFake
    ? "text-red-400"
    : isReal
    ? "text-emerald-400"
    : "text-yellow-400";

  const barColor = isFake
    ? "bg-red-500"
    : isReal
    ? "bg-emerald-500"
    : "bg-yellow-500";

  const icon = isFake ? (
    <AlertTriangle size={26} className="text-red-400" />
  ) : isReal ? (
    <CheckCircle2 size={26} className="text-emerald-400" />
  ) : (
    <AlertCircle size={26} className="text-yellow-400" />
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scaleIn">
        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 flex justify-center">
          <h3 className="text-lg font-bold text-white flex items-center gap-3">
            <ScanEye size={22} className="text-indigo-400" />
            Detection Result
          </h3>
        </div>

        <div className="p-4 space-y-4">
          <div className="text-center">
            <p className="text-slate-400 text-[10px] font-medium mb-1">Original</p>
            <div className="rounded-lg overflow-hidden border border-slate-700 shadow-md mx-auto w-40 h-40">
              <img src={preview} alt="Original" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="bg-slate-800/70 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {icon}
                <div>
                  <h4 className={cn("text-lg font-bold", statusColor)}>{result.prediction}</h4>
                  <p className="text-slate-400 text-xs">Confidence</p>
                </div>
              </div>
              <span className="text-xl font-bold text-white font-mono bg-slate-700/80 px-3 py-1 rounded-md">
                {result.confidence}
              </span>
            </div>

            <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden">
              <div className={cn("h-full transition-all duration-1000 ease-out rounded-full", barColor)} style={{ width: result.confidence }} />
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-lg shadow-lg transition-all hover:shadow-purple-500/50 text-sm"
          >
            Analyze Another Image
          </button>
        </div>
      </div>
    </div>
  );
};

// Login Modal
const LoginModal = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    localStorage.setItem("aiUser", JSON.stringify({ username}));
    onLogin(username);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scaleIn">
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-indigo-900/20 to-purple-900/20">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
              <ScanEye size={22} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          </div>
          <p className="text-slate-400 text-center text-sm">Sign in to analyze images</p>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-slate-300 text-sm font-medium block">Username</label>
            <input
              className="w-full bg-slate-800/70 border border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 transition-all duration-200 outline-none"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-slate-300 text-sm font-medium block">Password</label>
            <input
              className="w-full bg-slate-800/70 border border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 transition-all duration-200 outline-none"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !username || !password}
            className={cn(
              "w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2",
              (isLoading || !username || !password)
                ? "opacity-50 cursor-not-allowed"
                : "hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98]"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                <CheckCircle2 size={20} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="px-6 py-4 border-t border-white/10 bg-slate-900/50">
          <p className="text-slate-500 text-xs text-center">
            Secure authentication • Your privacy matters
          </p>
        </div>
      </div>
    </div>
  );
};

// Terms & Conditions Modal
const TermsModal = ({ onClose }) => (
  <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
    <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-scaleIn">
      <div className="p-6 border-b border-white/10 bg-gradient-to-r from-indigo-900/20 to-purple-900/20">
        <h2 className="text-2xl font-bold text-white text-center">Terms & Conditions</h2>
      </div>

      <div className="p-6 space-y-4 text-slate-300 text-sm">
        <p>
          By using this AI Image Detector, you acknowledge and agree that any image you upload will not be stored,
          shared, or used for any purpose other than generating an immediate analysis result. We prioritize your
          privacy and ensure that your data is strongly protected using secure protocols. Your uploaded images
          remain strictly confidential and are automatically discarded after analysis.
        </p>
        <p>
          We do not track, save, or distribute any personal data associated with your usage. This service is designed
          to provide instant AI detection while keeping your information fully secure.
        </p>
        <p>
          By continuing, you confirm that you understand and accept these terms.
        </p>
      </div>

      <div className="px-6 py-4 border-t border-white/10 bg-slate-900/50 flex justify-end">
        <button
          onClick={onClose}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2 rounded-xl shadow-lg transition-all hover:shadow-indigo-500/50"
        >
          I Understand
        </button>
      </div>
    </div>
  </div>
);

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);
  const [termsOpen, setTermsOpen] = useState(true); // Show Terms Modal initially
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("aiUser"));
    if (savedUser) setUser(savedUser.username);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleFile = (selectedFile) => {
    if (!user) {
      showToast("Please login first!");
      return;
    }
    if (!selectedFile) return;
    if (selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    } else {
      showToast("Invalid file! Please upload an image (PNG, JPG, WebP).");
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      showToast("No image uploaded! Please select an image first.");
      return;
    }
    if (!navigator.onLine) {
      showToast("No Internet Connectivity!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "https://priyam980-ai-detector-backend.hf.space/predict",
        formData,
        { timeout: 8000 }
      );
      setResult(res.data);
    } catch (err) {
      if (err.message === "Network Error" || err.code === "ERR_NETWORK") {
        showToast("No Internet Connectivity!");
      } else if (err.code === "ECONNABORTED") {
        showToast("Server not responding! Please try after some time.");
      } else if (!err.response) {
        showToast("Unable to connect! Backend may be down.");
      } else if (err.response.status >= 500) {
        showToast("Server error! Please try again later.");
      } else {
        showToast("Something went wrong! Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleLogout = () => {
    localStorage.removeItem("aiUser");
    setUser(null);
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  return (
    <>
      <style jsx>{`
        @keyframes slideDown { from { transform: translate(-50%, -100px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-slideDown { animation: slideDown 0.5s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.4s ease-out; }
      `}</style>

      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center p-4">
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}

        {termsOpen && <TermsModal onClose={() => setTermsOpen(false)} />}
        {!user && !termsOpen && <LoginModal onLogin={setUser} />}

        {user && (
          <div className="w-full max-w-lg flex justify-between items-center mb-4 p-2 bg-slate-900/50 rounded-xl text-white text-lg font-bold">
            <span className="mx-auto">Welcome, {user}</span>
            <button onClick={handleLogout} className="flex items-center gap-1 px-3 py-1 bg-red-600 rounded-lg hover:bg-red-500">
              <LogOut size={18} /> Logout
            </button>
          </div>
        )}

        {result && <ResultAlert result={result} preview={preview} onClose={clearImage} />}

        <div className="w-full max-w-lg bg-slate-900/70 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-70"></div>

          <div className="p-8 pb-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/20">
                <ScanEye size={28} />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                AI Image <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Detector</span>
              </h1>
              <p className="text-slate-400 text-sm mt-2">Detect AI-generated images instantly</p>
            </div>

            {!preview ? (
              <div
                className={cn(
                  "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 group",
                  dragActive ? "border-indigo-500 bg-indigo-500/10" : "border-slate-600 hover:border-indigo-400/60 hover:bg-slate-800/40 bg-slate-800/30"
                )}
                onDragEnter={e => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
                onDragLeave={e => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }}
                onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={e => { e.preventDefault(); e.stopPropagation(); setDragActive(false); handleFile(e.dataTransfer.files[0]); }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={e => handleFile(e.target.files[0])} />
                <Upload className="w-14 h-14 mx-auto mb-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                <p className="text-slate-200 font-medium text-lg">Click to upload or drag & drop</p>
                <p className="text-slate-500 text-sm mt-1">PNG, JPG, WebP • Max 10MB</p>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-900/80 group">
                <div className="flex items-center justify-center bg-slate-900/60 py-8 px-4">
                  <img
                    src={preview}
                    alt="Uploaded"
                    className="max-w-full max-h-96 object-contain rounded-lg shadow-2xl ring-2 ring-indigo-500/30"
                  />
                </div>

                <button
                  onClick={clearImage}
                  className="absolute top-4 right-4 z-50 p-3 bg-black/70 hover:bg-red-600 text-white rounded-full backdrop-blur-md transition-all hover:scale-110 shadow-xl"
                >
                  <X size={20} />
                </button>

                {!result && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm group-hover:bg-black/50 transition-all">
                    <button
                      onClick={handleAnalyze}
                      disabled={loading}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl flex items-center gap-3 transform hover:scale-105 active:scale-95 transition-all disabled:opacity-70"
                    >
                      {loading ? (
                        <> <Loader2 className="animate-spin" size={26} /> Analyzing... </>
                      ) : (
                        <> <ScanEye size={26} /> Detect Image </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="px-8 py-5 border-t border-white/10 bg-slate-900/80 text-center">
            <p className="text-white text-sm font-semibold tracking-wide drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]">
              Develop By Priyam Dave
            </p>
          </div>

        </div>
      </div>
    </>
  );
}

export default App;
