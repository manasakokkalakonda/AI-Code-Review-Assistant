import React, { useState } from 'react';

export default function SubmitCode() {
  const [codeSnippet, setCodeSnippet] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ codeSnippet, file });
    alert("Code submitted successfully! (Backend integration coming next)");
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Review Code</h2>
      <p className="text-gray-500 mb-6 text-sm">Paste your source code or upload a file directly to analyze bugs and code quality.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Paste Area */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Paste Code Snippet</label>
          <textarea
            className="w-full h-64 p-4 font-mono text-xs bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="// Paste your functions or code lines here..."
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
          />
        </div>

        <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 after:flex-1 after:border-t after:border-gray-300">
          <p className="mx-4 text-sm text-gray-400 font-medium">OR</p>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Upload File</label>
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
          {file && <p className="mt-2 text-xs text-green-600">Selected file: {file.name}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
        >
          Analyze Code
        </button>
      </form>
    </div>
  );
}