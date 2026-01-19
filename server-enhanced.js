// ENHANCED CLOVER OAUTH SERVER WITH DASHBOARD API
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

// Your Clover app credentials (replace with real ones)
const CLIENT_ID = 'YOUR_CLIENT_ID';
const REDIRECT_URI = 'https://myserver-wk8h.onrender.com/callback';

const server = http.createServer((req, res) => {
    const parsed = url.parse(req.url, true);
    
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // HOME PAGE - Serve dashboard
    if (parsed.pathname === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end('<h1>✅ OAuth Server Ready</h1><p><a href="/dashboard">Dashboard</a> | <a href="/callback?code=TEST">Test Callback</a></p>');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
        return;
    }
    
    // DASHBOARD API - Get authorization URL
    if (parsed.pathname === '/auth-url') {
        const authUrl = `https://sandbox.dev.clover.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ url: authUrl, success: true }));
        return;
    }
    
    // CALLBACK ENDPOINT - THIS IS WHAT FIXES INFINITE LOADING
    if (parsed.pathname === '/callback') {
        const code = parsed.query.code;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            success: true, 
            message: '✅ Callback received!', 
            code: code,
            next_step: 'Exchange this code for access token'
        }));
        return;
    }
    
    // 404 - Not found
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint not found', path: parsed.pathname }));
});

server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🔗 Dashboard: http://localhost:${PORT}/`);
    console.log(`🔗 Test: http://localhost:${PORT}/callback?code=TEST`);
});
