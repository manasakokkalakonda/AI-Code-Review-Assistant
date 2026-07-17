const handleAnalyze = async () => {
    const res = await fetch('http://localhost:5000/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: userCode })
    });
    const data = await res.json(); // This is the JSON from the backend
    
    // Update your state so the UI boxes display the correct info
    setSyntaxError(data.error);      // Put this into your "Syntax Error Found" box
    setSuggestedFix(data.fixedCode); // Put this into your "Suggested Fix" box
};