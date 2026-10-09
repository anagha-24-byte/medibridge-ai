# ==============================================================================
# MediBridge AI - Lightweight Zero-Dependency Local HTTP Server & AI Backend
# Uses native Windows .NET HttpListener (no Node.js or Python required!)
# Securely proxies LLM calls keeping API keys safely on the server
# ==============================================================================

$port = 8080
$prefix = "http://localhost:$port/"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    Write-Host "Port $port seems occupied or requires elevation. Falling back to default browser direct open." -ForegroundColor Yellow
    Start-Process (Join-Path $scriptDir "index.html")
    exit
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "               MediBridge AI Web Server                   " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Running at: $prefix" -ForegroundColor White
Write-Host "Serving from: $scriptDir" -ForegroundColor Gray
if ($env:GEMINI_API_KEY) {
    Write-Host "Server AI Provider: Google Gemini (Active via GEMINI_API_KEY)" -ForegroundColor Green
} else {
    Write-Host "Server AI Provider: Unconfigured (Set GEMINI_API_KEY env var for cloud LLM)" -ForegroundColor Yellow
}
Write-Host "Press Ctrl+C in this PowerShell window to stop the server." -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

# Open default browser
Start-Process $prefix

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # Always enable CORS for local API access
        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.Close()
            continue
        }

        $urlPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($urlPath)) {
            $urlPath = "index.html"
        }

        # -------------------------------------------------------------
        # API Route: /api/health
        # -------------------------------------------------------------
        if ($urlPath -eq "api/health") {
            $response.ContentType = "application/json; charset=utf-8"
            $hasGemini = -not [string]::IsNullOrEmpty($env:GEMINI_API_KEY)
            $payload = @{
                status = "ok"
                server = "MediBridge Native PowerShell Server"
                geminiConfigured = $hasGemini
            } | ConvertTo-Json
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($payload)
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
            continue
        }

        # -------------------------------------------------------------
        # API Route: /api/chat (Secure Server-Side LLM Proxy)
        # -------------------------------------------------------------
        if ($urlPath -eq "api/chat" -and $request.HttpMethod -eq "POST") {
            $response.ContentType = "application/json; charset=utf-8"
            
            $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
            $body = $reader.ReadToEnd()
            $reqData = $body | ConvertFrom-Json

            $apiKey = $env:GEMINI_API_KEY
            if (-not $apiKey -and $reqData.clientApiKey) {
                $apiKey = $reqData.clientApiKey
            }

            if (-not $apiKey) {
                $response.StatusCode = 400
                $errPayload = @{
                    success = $false
                    error = "NO_API_KEY"
                    message = "No Gemini API key configured on server. Please set GEMINI_API_KEY or enter your key in settings."
                } | ConvertTo-Json
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($errPayload)
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.Close()
                continue
            }

            try {
                # Format messages for Gemini API
                $contents = @()
                if ($reqData.history) {
                    foreach ($h in $reqData.history) {
                        $role = if ($h.role -eq "user") { "user" } else { "model" }
                        $contents += @{
                            role = $role
                            parts = @(@{ text = $h.text })
                        }
                    }
                }
                $contents += @{
                    role = "user"
                    parts = @(@{ text = $reqData.message })
                }

                $geminiBody = @{
                    contents = $contents
                    systemInstruction = @{
                        parts = @(@{ text = $reqData.systemInstruction })
                    }
                    generationConfig = @{
                        temperature = 0.4
                        topP = 0.95
                        maxOutputTokens = 2048
                    }
                } | ConvertTo-Json -Depth 10

                $apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$apiKey"
                $geminiRes = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $geminiBody -ContentType "application/json" -TimeoutSec 25

                if ($geminiRes.candidates -and $geminiRes.candidates.Count -gt 0) {
                    $replyText = $geminiRes.candidates[0].content.parts[0].text
                    $resPayload = @{
                        success = $true
                        reply = $replyText
                        provider = "Google Gemini 1.5 Flash (Secure Server Proxy)"
                    } | ConvertTo-Json
                } else {
                    throw "Empty response from Gemini API"
                }

                $bytes = [System.Text.Encoding]::UTF8.GetBytes($resPayload)
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } catch {
                $response.StatusCode = 502
                $errMsg = $_.Exception.Message
                $errPayload = @{
                    success = $false
                    error = "AI_GATEWAY_ERROR"
                    message = "LLM request failed: $errMsg"
                } | ConvertTo-Json
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($errPayload)
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }

            $response.Close()
            continue
        }

        # -------------------------------------------------------------
        # API Route: /api/simplify (Strict Medical Simplifier Proxy)
        # -------------------------------------------------------------
        if ($urlPath -eq "api/simplify" -and $request.HttpMethod -eq "POST") {
            $response.ContentType = "application/json; charset=utf-8"
            
            $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
            $body = $reader.ReadToEnd()
            $reqData = $body | ConvertFrom-Json

            $apiKey = $env:GEMINI_API_KEY
            if (-not $apiKey -and $reqData.clientApiKey) {
                $apiKey = $reqData.clientApiKey
            }

            if (-not $apiKey) {
                $response.StatusCode = 400
                $errPayload = @{
                    success = $false
                    error = "NO_API_KEY"
                    message = "No Gemini API key configured on server. Falling back to local verified clinical knowledge base."
                } | ConvertTo-Json
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($errPayload)
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.Close()
                continue
            }

            try {
                $term = $reqData.term
                $lang = if ($reqData.language) { $reqData.language } else { "en" }
                $sysInstruction = if ($reqData.systemInstruction) { $reqData.systemInstruction } else { "You are a medical information simplification assistant. Accurately explain the exact medical topic requested by the user." }

                $userPrompt = "Explain the exact medical term: `"$term`" in language: `"$lang`". Output valid JSON conforming to the schema."

                $geminiBody = @{
                    contents = @(
                        @{
                            role = "user"
                            parts = @(@{ text = $userPrompt })
                        }
                    )
                    systemInstruction = @{
                        parts = @(@{ text = $sysInstruction })
                    }
                    generationConfig = @{
                        temperature = 0.2
                        topP = 0.95
                        maxOutputTokens = 2048
                        responseMimeType = "application/json"
                    }
                } | ConvertTo-Json -Depth 10

                $apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$apiKey"
                $geminiRes = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $geminiBody -ContentType "application/json" -TimeoutSec 25

                if ($geminiRes.candidates -and $geminiRes.candidates.Count -gt 0) {
                    $jsonText = $geminiRes.candidates[0].content.parts[0].text.Trim()
                    if ($jsonText.StartsWith("```json")) {
                        $jsonText = $jsonText.Substring(7)
                    }
                    if ($jsonText.StartsWith("```")) {
                        $jsonText = $jsonText.Substring(3)
                    }
                    if ($jsonText.EndsWith("```")) {
                        $jsonText = $jsonText.Substring(0, $jsonText.Length - 3)
                    }
                    $jsonText = $jsonText.Trim()
                    $parsed = $jsonText | ConvertFrom-Json

                    $resPayload = @{
                        success = $true
                        result = $parsed
                        provider = "Google Gemini 1.5 Flash (Strict Simplifier Proxy)"
                    } | ConvertTo-Json -Depth 10
                } else {
                    throw "Empty response from Gemini API"
                }

                $bytes = [System.Text.Encoding]::UTF8.GetBytes($resPayload)
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } catch {
                $response.StatusCode = 502
                $errMsg = $_.Exception.Message
                $errPayload = @{
                    success = $false
                    error = "AI_GATEWAY_ERROR"
                    message = "LLM request failed: $errMsg"
                } | ConvertTo-Json
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($errPayload)
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }

            $response.Close()
            continue
        }

        # -------------------------------------------------------------
        # Static File Serving
        # -------------------------------------------------------------
        $filePath = Join-Path $scriptDir $urlPath

        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            # Determine content type
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".svg"  { "image/svg+xml" }
                ".ico"  { "image/x-icon" }
                Default { "application/octet-stream" }
            }

            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $notFoundBytes = [System.Text.Encoding]::UTF8.GetBytes("404 - File Not Found")
            $response.OutputStream.Write($notFoundBytes, 0, $notFoundBytes.Length)
        }
        $response.Close()
    } catch {
        # Catch break/termination
        break
    }
}

$listener.Stop()
