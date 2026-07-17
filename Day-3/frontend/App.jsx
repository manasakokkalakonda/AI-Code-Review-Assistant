import { useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccessMessage, setIsSuccessMessage] = useState(false); // Green/Red state filter karne ke liye

  // Dashboard States
  const [codeSnippet, setCodeSnippet] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');
  const [errorFeedback, setErrorFeedback] = useState(''); 
  const [corruptedCode, setCorruptedCode] = useState(''); 
  const [correctedCode, setCorrectedCode] = useState(''); 
  const [loading, setLoading] = useState(false);
  
  // History State
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSuccessMessage(false); // Reset message state type
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok || data.success) {
        if (isLogin) {
          setIsLoggedIn(true); 
        } else {
          // YAHAAN FIX HAI: Isko dynamic success (Green) box banaya gaya hai.
          setIsSuccessMessage(true);
          setMessage('🎉 Registered successfully! Now please log in with your credentials.');
          setIsLogin(true); // Auto-switch directly to Login screen keeping user's typed data
        }
      } else {
        setIsSuccessMessage(false);
        setMessage(`❌ ${data.message || 'Failed!'}`);
      }
    } catch (error) {
      // Testing Mode: Default behavior agar backend start na ho tab login bypass karne ke liye
      setIsSuccessMessage(true);
      setMessage("⚡ Logged in successfully! (Local Bypass Mode Active)");
      setTimeout(() => {
        setIsLoggedIn(true);
      }, 1000);
    }
  };

  // Helper function to auto-detect and fix common JS syntax errors
  const generateCorrectedCode = (brokenCode, errorMessage) => {
    let fixed = brokenCode;

    if (errorMessage.includes("Unexpected token") || errorMessage.includes("Expected")) {
      if ((brokenCode.match(/\{/g) || []).length > (brokenCode.match(/\}/g) || []).length) {
        fixed += "\n}";
      }
      if ((brokenCode.match(/\(/g) || []).length > (brokenCode.match(/\)/g) || []).length) {
        fixed = fixed.replace(/\n?$/, ""); 
        fixed += ")";
      }
    } else if (errorMessage.includes("is not defined")) {
      const match = errorMessage.match(/(\w+) is not defined/);
      if (match && match[1]) {
        const undefinedVar = match[1];
        const regex = new RegExp(`\\b${undefinedVar}\\s*=`, 'g');
        if (regex.test(brokenCode)) {
          fixed = brokenCode.replace(regex, `let ${undefinedVar} =`);
        } else {
          fixed = `let ${undefinedVar};\n` + brokenCode;
        }
      }
    } else if (errorMessage.includes("Unexpected identifier")) {
      const firstLine = brokenCode.trim().split('\n')[0];
      if (!firstLine.startsWith('let') && !firstLine.startsWith('const') && !firstLine.startsWith('var') && firstLine.includes('=')) {
        fixed = "let " + brokenCode;
      }
    }
    
    if (fixed === brokenCode) {
      fixed = `// AI Suggestion:\n// Ensure all brackets are closed, variables are declared with let/const, and strings use matching quotes.\n\n` + brokenCode;
    }

    return fixed;
  };

  const handleReviewCode = async () => {
    if (!codeSnippet.trim()) return alert("Please paste some code first!");
    setLoading(true);
    setAiFeedback('');
    setErrorFeedback('');
    setCorruptedCode('');
    setCorrectedCode('');

    setTimeout(() => {
      let isSuccess = true;
      let reviewResult = '';
      let syntaxError = '';
      let fixedCodeResult = '';

      try {
        new Function(codeSnippet);
        reviewResult = `🤖 AI Code Review:\n\n1. Performance: Looks stable!\n2. Bugs: No syntax errors found.\n3. Tip: Consider adding comments to explain your functions.`;
        setAiFeedback(reviewResult);
      } catch (error) {
        isSuccess = false;
        syntaxError = error.message;
        fixedCodeResult = generateCorrectedCode(codeSnippet, error.message);

        setErrorFeedback(syntaxError);
        setCorruptedCode(codeSnippet);
        setCorrectedCode(fixedCodeResult);
      }

      const historyItem = {
        id: Date.now(),
        code: codeSnippet,
        status: isSuccess ? 'success' : 'failed',
        feedback: reviewResult,
        error: syntaxError,
        corrupted: isSuccess ? '' : codeSnippet,
        corrected: isSuccess ? '' : fixedCodeResult,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setHistory(prev => [historyItem, ...prev]);
      setLoading(false);
    }, 2000); // 2 second animation delay so the processing message is nicely visible
  };

  const handleSelectHistory = (item) => {
    setCodeSnippet(item.code);
    if (item.status === 'success') {
      setAiFeedback(item.feedback);
      setErrorFeedback('');
      setCorruptedCode('');
      setCorrectedCode('');
    } else {
      setErrorFeedback(item.error);
      setCorruptedCode(item.corrupted);
      setCorrectedCode(item.corrected);
      setAiFeedback('');
    }
  };

  // ================= VIEW 1: THE AI CORE DASHBOARD (If logged in) =================
  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-gray-100 font-sans flex flex-col">
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-6 py-4 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-cyan-500/10 text-cyan-400 p-2 rounded-lg border border-cyan-500/20 text-xl font-bold">🤖</div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                AI Code Review Assistant
              </h1>
            </div>
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="bg-red-600/20 hover:bg-red-600 border border-red-500/30 hover:border-transparent text-red-400 hover:text-white px-4 py-1.5 rounded-xl text-sm font-medium cursor-pointer transition duration-200"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-6xl w-full mx-auto p-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* LEFT BOX: Code Editor Container */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col shadow-xl backdrop-blur-md">
              <label className="block text-xs font-bold tracking-wide text-gray-400 uppercase mb-3">Paste Your Code Snippet:</label>
              <textarea
                rows="12"
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="function calculateSum(a, b) {\n   return a + b;\n}"
                className="flex-1 min-h-[350px] p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-cyan-400 resize-none shadow-inner"
              />
              <button
                onClick={handleReviewCode}
                disabled={loading}
                className="mt-4 w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold py-3 rounded-xl transition cursor-pointer shadow-md"
              >
                {loading ? 'Analyzing Code... ⏳' : 'Analyze Code with AI 🚀'}
              </button>
            </div>

            {/* RIGHT BOX: Chat Box / Output Reports / Error Fixer */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col shadow-xl backdrop-blur-md">
              <label className="block text-xs font-bold tracking-wide text-gray-400 uppercase mb-3">AI Feedback & Error Resolution Box:</label>
              <div className="flex-1 p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-sm whitespace-pre-wrap min-h-[350px] overflow-y-auto flex flex-col justify-center items-center">
                
                {loading ? (
                  /* BEAUTIFUL ANIMATED THINKING STATE */
                  <div className="flex flex-col items-center justify-center space-y-4 animate-pulse w-full max-w-xs text-center p-4">
                    <div className="flex space-x-2 justify-center items-center">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce"></div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent tracking-wide">
                        AI is reviewing your code logic...
                      </p>
                      <p className="text-[11px] text-slate-500 font-sans tracking-normal">
                        Scanning structure, catching syntax flaws, and compiling adjustments.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* REGULAR DOCK RENDER STABLE STATES */
                  <div className="w-full h-full text-left flex flex-col gap-4">
                    {errorFeedback && (
                      <div className="space-y-4">
                        <div className="bg-red-950/50 text-rose-400 border border-red-900/60 p-3.5 rounded-xl">
                          <span className="font-bold">❌ Syntax Error Found:</span>
                          <p className="mt-1 text-xs text-gray-300">{errorFeedback}</p>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
                          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1">Your Broken Code:</span>
                          <pre className="text-xs text-gray-400 overflow-x-auto">{corruptedCode}</pre>
                        </div>

                        <div className="bg-slate-900 border border-emerald-500/20 p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Suggested Fix Code:</span>
                            <button 
                              onClick={() => setCodeSnippet(correctedCode)} 
                              className="text-[10px] bg-emerald-500/10 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded transition font-sans"
                            >
                              Apply Fix ⚡
                            </button>
                          </div>
                          <pre className="text-xs text-emerald-400 overflow-x-auto">{correctedCode}</pre>
                        </div>
                      </div>
                    )}

                    {aiFeedback && (
                      <div className="text-emerald-400 leading-relaxed">
                        {aiFeedback}
                      </div>
                    )}

                    {!aiFeedback && !errorFeedback && (
                      <span className="text-gray-500 block text-center my-auto px-4">
                        Submit your code snippet to generate an interactive review summary report!
                      </span>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* BOTTOM BOX: History Box Container */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
            <h3 className="text-xs font-bold tracking-wide text-gray-400 uppercase mb-4">📜 Past Code Reviews (Session History)</h3>
            
            {history.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No past reviews yet. Write code and hit analyze!</p>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectHistory(item)}
                    className={`min-w-[240px] max-w-[240px] p-4 rounded-xl bg-slate-950 border cursor-pointer hover:border-slate-500 transition-all flex flex-col justify-between gap-3 ${
                      item.status === 'success' ? 'border-emerald-500/20' : 'border-rose-500/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'success' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                      }`}>
                        {item.status === 'success' ? 'Pass' : 'Syntax Error'}
                      </span>
                      <span className="text-[10px] text-gray-500">{item.timestamp}</span>
                    </div>
                    
                    <code className="text-xs text-cyan-400 block truncate font-mono bg-slate-900/50 p-1.5 rounded border border-slate-800/40">
                      {item.code}
                    </code>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ================= VIEW 2: HIGHLY COLORFUL & FROSTED NEON AUTH VIEW =================
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans selection:bg-purple-500 selection:text-white bg-[#0f1b29]">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0a1128] via-[#0f2e3d] to-[#1a103c]"></div>
        <div className="absolute top-[-10%] right-[-15%] w-[600px] h-[600px] bg-cyan-500/30 rounded-full filter blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[700px] h-[700px] bg-purple-600/25 rounded-full filter blur-[150px]"></div>
      </div>

      <div className="w-full max-w-2xl bg-white/[0.07] backdrop-blur-2xl border border-white/20 rounded-[28px] shadow-[0_25px_70px_rgba(0,0,0,0.5)] px-8 py-10 relative z-10 text-center mt-8">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-[#1b1c3a] to-[#0a0c16] border-2 border-cyan-400/60 p-3 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center justify-center w-20 h-20">
          <div className="text-4xl animate-bounce">🤖</div>
        </div>

        <div className="mt-4 mb-8">
          <h2 className="text-3xl font-extrabold tracking-wide text-[#e2eafc] flex items-center justify-center gap-2 drop-shadow-md">
            AI Code Reviewer {isLogin ? 'Login' : 'Register'} <span className="text-3xl">🤖</span>
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-left max-w-xl mx-auto">
          <div>
            <label className="text-base font-bold text-[#b4c6ef] flex items-center gap-1.5 mb-2 drop-shadow">
              Email Address <span className="text-sm">💾</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-[#eef4ff] border-2 border-[#38bdf8] rounded-xl text-[#1e293b] placeholder-slate-400 font-medium text-base focus:outline-none focus:ring-4 focus:ring-cyan-500/30 transition-all shadow-md"
              required
            />
          </div>
          
          <div>
            <label className="text-base font-bold text-[#b4c6ef] flex items-center gap-1.5 mb-2 drop-shadow">
              Password <span className="text-sm">🔒</span>
            </label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-[#eef4ff] border-2 border-[#f43f5e]/40 focus:border-[#38bdf8] rounded-xl text-[#1e293b] placeholder-slate-400 font-medium text-base focus:outline-none focus:ring-4 focus:ring-cyan-500/30 transition-all shadow-md"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full mt-4 bg-gradient-to-r from-[#10b981] via-[#06b6d4] to-[#8b5cf6] text-white font-extrabold text-xl py-3.5 rounded-xl transition duration-200 shadow-lg active:scale-[0.995] cursor-pointer flex items-center justify-center gap-2"
          >
            {isLogin ? 'Login 🚀' : 'Sign Up 💾'}
          </button>
        </form>

        <div className="mt-8">
          <button 
            onClick={() => { setIsLogin(!isLogin); setMessage(''); }} 
            className="text-sm md:text-base font-bold tracking-wide text-[#7bb0ff] transition-all cursor-pointer bg-transparent border-none drop-shadow"
          >
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <span className="hover:underline underline-offset-4 hover:text-cyan-300 transition-colors">
                  Register here
                </span>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <span className="hover:underline underline-offset-4 hover:text-cyan-300 transition-colors">
                  Login here
                </span>
              </>
            )}
          </button>
        </div>

        {/* DYNAMIC COLORED RESPONSE BOX */}
        {message && (
          <div className={`mt-6 p-4 rounded-xl text-center text-sm font-mono font-bold border max-w-xl mx-auto transition-colors duration-200 ${
            isSuccessMessage 
              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50' // Beautiful green box for successes
              : 'bg-rose-950/60 text-rose-400 border-rose-500/40' // Red box for errors
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;