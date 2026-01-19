// SIMPLE CLOVER OAUTH SERVER THAT WORKS
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    const parsed = url.parse(req.url, true);
    console.log(`Request: ${req.url}`);
    
    // HOME PAGE
    if (parsed.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>✅ OAuth Server Ready</h1><p><a href="/callback?code=TEST">Test</a></p>');
        return;
    }
    
    // CALLBACK ENDPOINT - THIS IS WHAT FIXES INFINITE LOADING
    if (parsed.pathname === '/callback') {
        const code = parsed.query.code;
        
        // CRITICAL: Return SIMPLE HTML that Clover can parse
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>OAuth Complete</title>
                <script type="text/javascript">
                    // Extract code from URL
                    var urlParams = new URLSearchParams(window.location.search);
                    var code = urlParams.get('code');
                    var state = urlParams.get('state');
                    
                    // If we have a code (success)
                    if (code) {
                        // If opened in popup, send to parent and close
                        if (window.opener && !window.opener.closed) {
                            window.opener.postMessage({
                                type: 'oauth_callback',
                                code: code,
                                state: state,
                                success: true
                            }, '*');
                            
                            // Close after short delay
                            setTimeout(function() {
                                window.close();
                            }, 500);
                        }
                        
                        // Update page to show success
                        document.getElementById('message').innerHTML = 
                            '<h1 style="color: green;">✅ OAuth Successful!</h1>' +
                            '<p>Authorization code: ' + code + '</p>' +
                            '<p>This window will close automatically...</p>';
                    } else {
                        // No code (error or user cancelled)
                        document.getElementById('message').innerHTML = 
                            '<h1 style="color: orange;">⚠️ No Authorization Code</h1>' +
                            '<p>Try again or check OAuth configuration.</p>';
                    }
                </script>
            </head>
            <body style="font-family: Arial; padding: 40px; text-align: center;">
                <div id="message">
                    <h1>Processing OAuth...</h1>
                    <p>Please wait...</p>
                </div>
            </body>
            </html>
        `;
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
        return;
    }
    
    // 404
    res.writeHead(404);
    res.end('Not Found');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🔗 Test: http://localhost:${PORT}/callback?code=TEST`);
});
