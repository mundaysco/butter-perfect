# ONE-COMMAND DEPLOYMENT FOR BUTTER
Write-Host "🚀 ONE-COMMAND BUTTER DEPLOYMENT" -ForegroundColor Cyan

# 1. Delete old service FIRST
Write-Host "`n1. PLEASE DELETE OLD SERVICE:" -ForegroundColor Red
Write-Host "   • Go to: https://dashboard.render.com"
Write-Host "   • Find: myserver-wk8h"
Write-Host "   • Delete it completely"
Write-Host "   • Press Enter when done" -ForegroundColor Yellow
Read-Host

# 2. Create new service
Write-Host "`n2. CREATE NEW SERVICE:" -ForegroundColor Green
Write-Host "   • Click 'New +' → 'Web Service'"
Write-Host "   • Scroll to 'Manual Deploy'"
Write-Host "   • Upload: butter-100percent-working.zip"
Write-Host "   • Name: butter-perfect"
Write-Host "   • Build Command: npm install"
Write-Host "   • Start Command: node server.js"
Write-Host "   • Click 'Create Web Service'"

# 3. Wait and get URL
Write-Host "`n3. WAIT 2 minutes for deployment" -ForegroundColor Yellow
Write-Host "   Your URL will be: https://butter-perfect.onrender.com"

# 4. Update Clover
$newUrl = "https://butter-perfect.onrender.com"
Write-Host "`n4. UPDATE CLOVER WITH:" -ForegroundColor Magenta
Write-Host "   Site URL: $newUrl"
Write-Host "   Redirect URI: $newUrl/callback"

# 5. Generate test OAuth URL
$encoded = [System.Web.HttpUtility]::UrlEncode("$newUrl/callback")
$oauthTestUrl = "https://www.clover.com/oauth/authorize?client_id=JD06DKTZ0E7MT&redirect_uri=$encoded&response_type=code"
Write-Host "`n5. TEST OAUTH URL:" -ForegroundColor Cyan
Write-Host $oauthTestUrl

# 6. Save everything to file
$deployInfo = @"
=== BUTTER 100% WORKING DEPLOYMENT ===
1. Delete: myserver-wk8h
2. Create new: butter-perfect
3. Upload: butter-100percent-working.zip
4. URL: $newUrl
5. Clover Site URL: $newUrl
6. Clover Redirect URI: $newUrl/callback
7. Test OAuth: $oauthTestUrl

UPDATE THESE IN CLOVER DEVELOPER DASHBOARD:
1. Go to: https://www.clover.com/developers/developer-dashboard
2. Edit your app
3. REST Configuration → Site URL: $newUrl
4. OAuth Settings → Add Redirect URI: $newUrl/callback
"@

$deployInfo | Out-File -FilePath "DEPLOYMENT_FINAL.txt" -Encoding UTF8
Write-Host "`n✅ Deployment info saved to: DEPLOYMENT_FINAL.txt" -ForegroundColor Green

# Open browser to Render
Start-Process "https://dashboard.render.com"

# Open deployment instructions
notepad "DEPLOYMENT_FINAL.txt"
