import React from 'react';

function HistoryBox({ history, onSelectHistory }) {
  if (history.length === 0) {
    return (
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <h3 className="text-xs font-bold tracking-wide text-gray-400 uppercase mb-4">
          📜 Past Code Reviews (Session History)
        </h3>
        <p className="text-sm text-gray-500 italic">No past reviews yet. Write code and hit analyze!</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
      <h3 className="text-xs font-bold tracking-wide text-gray-400 uppercase mb-4">
        📜 Past Code Reviews (Session History)
      </h3>
      
      <div className="flex gap-4 overflow-x-auto pb-2">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectHistory(item)}
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
    </div>
  );
}

export default HistoryBox;