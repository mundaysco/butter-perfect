// CLEAN SERVER - NO FILE READING
const http = require("http");
const url = require("url");

const PORT = process.env.PORT || 3000;
const CLIENT_ID = "JD06DKTZ0E7MT";

// Simple HTML as string
const HTML = \`<!DOCTYPE html>
<html>
<head>
    <title>🧈 Butter Dashboard</title>
    <style>
        body { font-family: Arial; padding: 20px; background: #f0f8ff; }
        .card { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="card">
        <h1>✅ Butter Dashboard - WORKING</h1>
        <p><strong>App ID:</strong> \${CLIENT_ID}</p>
        <p><strong>URL:</strong> https://myserver-wk8h.onrender.com</p>
    </div>
    <div class="card">
        <button onclick="window.location.href='/auth-url'">🔗 Get Auth URL</button>
        <p><a href="/callback?code=TEST">Test Callback</a></p>
    </div>
</body>
</html>\`;

const server = http.createServer((req, res) => {
    const parsed = url.parse(req.url, true);
    
    // Home page
    if (parsed.pathname === "/") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(HTML);
        return;
    }
    
    // Auth URL endpoint
    if (parsed.pathname === "/auth-url") {
        const authUrl = \`https://sandbox.dev.clover.com/oauth/authorize?client_id=\${CLIENT_ID}&redirect_uri=https://myserver-wk8h.onrender.com/callback&response_type=code\`;
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ url: authUrl, success: true }));
        return;
    }
    
    // Callback endpoint
    if (parsed.pathname === "/callback") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ 
            success: true, 
            message: "Callback received", 
            code: parsed.query.code || "none"
        }));
        return;
    }
    
    // 404
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found", path: parsed.pathname }));
});

server.listen(PORT, () => {
    console.log(\`✅ Server running on port \${PORT}\`);
    console.log(\`🔗 Dashboard: https://myserver-wk8h.onrender.com/\`);
});
