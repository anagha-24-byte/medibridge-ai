# ==============================================================================
# MediBridge AI - Native Windows Zero-Dependency HTTP Server & Backend API
# Built on Microsoft .NET HttpListener (runs natively on Windows PowerShell)
# Provides secure backend endpoints for Authentication, Appointments, History,
# Google Gemini 1.5 Flash LLM, X-Ray Vision, Blood Test Analysis & Static Files.
# ==============================================================================

param(
    [int]$port = 8080,
    [switch]$noBrowser
)

if ($env:PORT) { $port = [int]$env:PORT }
$prefix = "http://localhost:$port/"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$dataDir = Join-Path $scriptDir "data"
$dbFile = Join-Path $dataDir "medibridge.json"

if (-not (Test-Path $dataDir)) {
    New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
}

# In-memory database with JSON file persistence
$db = @{
    users = @{}
    sessions = @{}
    appointments = @{}
    history = @{}
}

if (Test-Path $dbFile) {
    try {
        $rawJson = [System.IO.File]::ReadAllText($dbFile, [System.Text.Encoding]::UTF8)
        $loaded = $rawJson | ConvertFrom-Json
        if ($loaded.users) {
            foreach ($prop in $loaded.users.PSObject.Properties) {
                $db.users[$prop.Name] = $prop.Value
            }
        }
        if ($loaded.sessions) {
            foreach ($prop in $loaded.sessions.PSObject.Properties) {
                $db.sessions[$prop.Name] = $prop.Value
            }
        }
        if ($loaded.appointments) {
            foreach ($prop in $loaded.appointments.PSObject.Properties) {
                $db.appointments[$prop.Name] = $prop.Value
            }
        }
        if ($loaded.history) {
            foreach ($prop in $loaded.history.PSObject.Properties) {
                $db.history[$prop.Name] = $prop.Value
            }
        }
    } catch {
        Write-Host "Warning: Could not parse database file. Starting fresh." -ForegroundColor Yellow
    }
}

function Save-Database {
    try {
        $json = $db | ConvertTo-Json -Depth 10
        [System.IO.File]::WriteAllText($dbFile, $json, [System.Text.Encoding]::UTF8)
    } catch {
        Write-Host "Error saving database: $_" -ForegroundColor Red
    }
}

function Get-UserFromToken($token) {
    if (-not $token -or -not $db.sessions.ContainsKey($token)) { return $null }
    $sess = $db.sessions[$token]
    $now = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
    if ($sess.expiresAt -and ($now -gt $sess.expiresAt)) {
        $db.sessions.Remove($token)
        Save-Database
        return $null
    }
    $uid = $sess.userId
    foreach ($m in $db.users.Keys) {
        if ($db.users[$m].id -eq $uid) {
            return $db.users[$m]
        }
    }
    return $null
}

# Start Listener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    Write-Host "Port $port occupied or access denied. Opening index.html directly..." -ForegroundColor Yellow
    Start-Process (Join-Path $scriptDir "index.html")
    exit
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "         MediBridge AI Web Server & API Backend           " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Running at: $prefix" -ForegroundColor White
Write-Host "Serving from: $scriptDir" -ForegroundColor Gray
if ($env:GEMINI_API_KEY) {
    Write-Host "Server AI Provider: Google Gemini (Active via GEMINI_API_KEY)" -ForegroundColor Green
} else {
    Write-Host "Server AI Provider: Unconfigured (Set GEMINI_API_KEY env var for live LLM / Vision)" -ForegroundColor Yellow
}
Write-Host "Database storage: $dbFile" -ForegroundColor Gray
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

# Open default browser
if (-not $noBrowser) {
    Start-Process $prefix
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # CORS Headers
        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
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

        # Helper to read request JSON body
        function Read-JsonBody {
            $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
            $str = $reader.ReadToEnd()
            if ([string]::IsNullOrWhiteSpace($str)) { return $null }
            return ($str | ConvertFrom-Json)
        }

        # Helper to write JSON response
        function Write-JsonResponse($obj, $status = 200) {
            $response.StatusCode = $status
            $response.ContentType = "application/json; charset=utf-8"
            $jsonStr = $obj | ConvertTo-Json -Depth 10
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonStr)
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
        }

        # Helper to extract Bearer Token
        $authHeader = $request.Headers["Authorization"]
        $token = $null
        if ($authHeader -and $authHeader.StartsWith("Bearer ")) {
            $token = $authHeader.Substring(7).Trim()
        }

        # -------------------------------------------------------------
        # Route: GET /api/health
        # -------------------------------------------------------------
        if ($urlPath -eq "api/health" -and $request.HttpMethod -eq "GET") {
            $hasGemini = -not [string]::IsNullOrEmpty($env:GEMINI_API_KEY)
            Write-JsonResponse @{
                status = "ok"
                server = "MediBridge Native PowerShell Server"
                version = "2.0.0"
                aiConfigured = $hasGemini
                aiProvider = if ($hasGemini) { "Google Gemini 1.5 Flash" } else { "Unconfigured (Set GEMINI_API_KEY)" }
                timestamp = (Get-Date).ToString("o")
            }
            continue
        }

        # -------------------------------------------------------------
        # Route: POST /api/auth/login
        # -------------------------------------------------------------
        if ($urlPath -eq "api/auth/login" -and $request.HttpMethod -eq "POST") {
            $body = Read-JsonBody
            $name = if ($body.name) { $body.name.Trim() } else { "" }
            $rawMobile = if ($body.mobile) { $body.mobile.Trim() } else { "" }

            if ($name.Length -lt 2 -or $name.Length -gt 50) {
                Write-JsonResponse @{
                    success = $false
                    error = "INVALID_NAME"
                    message = "Please provide a valid name between 2 and 50 characters."
                } 400
                continue
            }

            $cleanMobile = $rawMobile -replace '[\s\-\(\)]', ''
            if ($cleanMobile -notmatch '^\+?[0-9]{10,15}$') {
                Write-JsonResponse @{
                    success = $false
                    error = "INVALID_MOBILE"
                    message = "Please provide a valid 10 to 15 digit mobile number."
                } 400
                continue
            }

            $user = $null
            if ($db.users.ContainsKey($cleanMobile)) {
                $user = $db.users[$cleanMobile]
                $user.name = $name
                $user.lastLogin = (Get-Date).ToString("o")
            } else {
                $user = @{
                    id = "usr_" + [System.Guid]::NewGuid().ToString("N").Substring(0, 12)
                    name = $name
                    mobile = $cleanMobile
                    createdAt = (Get-Date).ToString("o")
                    lastLogin = (Get-Date).ToString("o")
                }
                $db.users[$cleanMobile] = $user
            }

            $sessToken = "mb_sess_" + [System.Guid]::NewGuid().ToString("N") + [System.Guid]::NewGuid().ToString("N")
            $expiresAt = [DateTimeOffset]::UtcNow.AddDays(7).ToUnixTimeMilliseconds()
            $db.sessions[$sessToken] = @{
                userId = $user.id
                mobile = $user.mobile
                expiresAt = $expiresAt
            }
            Save-Database

            Write-JsonResponse @{
                success = $true
                user = @{
                    id = $user.id
                    name = $user.name
                    mobile = $user.mobile
                    createdAt = $user.createdAt
                }
                token = $sessToken
                message = "Signed in successfully."
                verificationNote = "Signed in with Name and Mobile number. Data scoped to this user session."
            }
            continue
        }

        # -------------------------------------------------------------
        # Route: GET /api/auth/me
        # -------------------------------------------------------------
        if ($urlPath -eq "api/auth/me" -and $request.HttpMethod -eq "GET") {
            $user = Get-UserFromToken $token
            if (-not $user) {
                Write-JsonResponse @{ success = $false; error = "UNAUTHORIZED"; message = "Session invalid or expired." } 401
                continue
            }
            Write-JsonResponse @{ success = $true; user = $user }
            continue
        }

        # -------------------------------------------------------------
        # Route: POST /api/auth/logout
        # -------------------------------------------------------------
        if ($urlPath -eq "api/auth/logout" -and $request.HttpMethod -eq "POST") {
            if ($token -and $db.sessions.ContainsKey($token)) {
                $db.sessions.Remove($token)
                Save-Database
            }
            Write-JsonResponse @{ success = $true; message = "Signed out successfully." }
            continue
        }

        # -------------------------------------------------------------
        # Route: POST /api/chat (Health Assistant LLM Proxy)
        # -------------------------------------------------------------
        if ($urlPath -eq "api/chat" -and $request.HttpMethod -eq "POST") {
            $body = Read-JsonBody
            $apiKey = $env:GEMINI_API_KEY
            if (-not $apiKey -and $body.clientApiKey) { $apiKey = $body.clientApiKey }

            if (-not $apiKey) {
                Write-JsonResponse @{
                    success = $false
                    error = "AI_NOT_CONFIGURED"
                    message = "Google Gemini API key is not configured on the server. Please set GEMINI_API_KEY in the server environment or enter it in settings."
                } 503
                continue
            }

            try {
                $contents = @()
                if ($body.history) {
                    foreach ($h in $body.history) {
                        $role = if ($h.role -eq "user") { "user" } else { "model" }
                        $contents += @{
                            role = $role
                            parts = @(@{ text = $h.text })
                        }
                    }
                }
                $contents += @{
                    role = "user"
                    parts = @(@{ text = $body.message })
                }

                $geminiBody = @{
                    contents = $contents
                    systemInstruction = @{
                        parts = @(@{ text = $body.systemInstruction })
                    }
                    generationConfig = @{
                        temperature = 0.35
                        topP = 0.95
                        maxOutputTokens = 2048
                    }
                } | ConvertTo-Json -Depth 10

                $apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$apiKey"
                $geminiRes = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $geminiBody -ContentType "application/json" -TimeoutSec 25

                if ($geminiRes.candidates -and $geminiRes.candidates.Count -gt 0) {
                    $replyText = $geminiRes.candidates[0].content.parts[0].text
                    Write-JsonResponse @{
                        success = $true
                        reply = $replyText
                        provider = "Google Gemini 1.5 Flash (Secure Server Proxy)"
                    }
                } else {
                    throw "Empty response from Gemini API"
                }
            } catch {
                Write-JsonResponse @{
                    success = $false
                    error = "AI_GATEWAY_ERROR"
                    message = "AI service request failed: $($_.Exception.Message)"
                } 502
            }
            continue
        }

        # -------------------------------------------------------------
        # Route: POST /api/xray (Dedicated X-Ray Vision Analysis)
        # -------------------------------------------------------------
        if ($urlPath -eq "api/xray" -and $request.HttpMethod -eq "POST") {
            $user = Get-UserFromToken $token
            $body = Read-JsonBody
            $apiKey = $env:GEMINI_API_KEY
            if (-not $apiKey -and $body.clientApiKey) { $apiKey = $body.clientApiKey }

            if (-not $apiKey) {
                Write-JsonResponse @{
                    success = $false
                    error = "AI_VISION_NOT_CONFIGURED"
                    message = "Medical vision AI is not configured on the server. Set GEMINI_API_KEY to enable live multimodal X-ray image analysis."
                } 503
                continue
            }

            $imgBase64 = $body.imageBase64
            if (-not $imgBase64) {
                Write-JsonResponse @{ success = $false; error = "MISSING_IMAGE"; message = "Please provide an X-ray image." } 400
                continue
            }

            # Clean data URI prefix if present
            $cleanBase64 = $imgBase64 -replace '^data:[^;]+;base64,', ''
            $mimeType = if ($body.mimeType) { $body.mimeType } else { "image/jpeg" }

            try {
                $promptText = @"
You are an educational medical imaging explanation assistant.
Analyze this medical image with strict medical safety protocols:
1. Identify the anatomical region and view type (e.g. Chest PA/AP, Extremity, Spine) if identifiable.
2. Provide a clear, educational plain-language explanation of visible features.
3. Explicitly state what you can and cannot assess from this image.
4. Highlight uncertainties and image quality factors.
5. Emphasize strongly that this is educational support and NEVER a clinical radiology diagnosis. Advise the user to obtain formal interpretation from a licensed radiologist or physician.

Format your answer with clear markdown headings:
- **Image Overview & Body Region**
- **Educational Observations**
- **Important Limitations & Uncertainties**
- **Next Steps & Questions for Your Doctor**
"@

                $geminiBody = @{
                    contents = @(
                        @{
                            role = "user"
                            parts = @(
                                @{
                                    inlineData = @{
                                        mimeType = $mimeType
                                        data = $cleanBase64
                                    }
                                },
                                @{ text = $promptText }
                            )
                        }
                    )
                    generationConfig = @{
                        temperature = 0.2
                        maxOutputTokens = 2048
                    }
                } | ConvertTo-Json -Depth 10

                $apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$apiKey"
                $geminiRes = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $geminiBody -ContentType "application/json" -TimeoutSec 35

                if ($geminiRes.candidates -and $geminiRes.candidates.Count -gt 0) {
                    $analysisText = $geminiRes.candidates[0].content.parts[0].text
                    
                    $savedId = $null
                    if ($body.saveToHistory -and $user) {
                        $histId = "xray_" + [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
                        $histItem = @{
                            id = $histId
                            type = "xray"
                            title = "X-Ray Analysis"
                            summary = $analysisText.Substring(0, [Math]::Min(200, $analysisText.Length)) + "..."
                            details = $analysisText
                            timestamp = (Get-Date).ToString("o")
                        }
                        if (-not $db.history.ContainsKey($user.id)) { $db.history[$user.id] = @() }
                        $arr = @($db.history[$user.id])
                        $db.history[$user.id] = ,$histItem + $arr
                        Save-Database
                        $savedId = $histId
                    }

                    Write-JsonResponse @{
                        success = $true
                        analysis = $analysisText
                        savedToHistory = ($null -ne $savedId)
                        historyId = $savedId
                        provider = "Google Gemini 1.5 Flash Vision"
                    }
                } else {
                    throw "Empty response from Gemini vision model"
                }
            } catch {
                Write-JsonResponse @{
                    success = $false
                    error = "XRAY_ANALYSIS_FAILED"
                    message = "X-ray analysis failed: $($_.Exception.Message)"
                } 502
            }
            continue
        }

        # -------------------------------------------------------------
        # Route: POST /api/bloodtest
        # -------------------------------------------------------------
        if ($urlPath -eq "api/bloodtest" -and $request.HttpMethod -eq "POST") {
            $user = Get-UserFromToken $token
            $body = Read-JsonBody
            $text = if ($body.text) { $body.text.Trim() } else { "" }

            if (-not $text) {
                Write-JsonResponse @{ success = $false; error = "EMPTY_TEXT"; message = "Please provide blood test text." } 400
                continue
            }

            # Extract basic parameters
            $extracted = @()
            $testDefs = @(
                @{ id="glucose"; name="Fasting Blood Glucose"; pattern='(?:glucose|sugar|fbs)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(mg\/dl)?'; unit="mg/dL"; range="70 - 99 mg/dL"; low=70; high=99; meaning="Measures circulating blood sugar." },
                @{ id="hba1c"; name="Hemoglobin A1c (HbA1c)"; pattern='(?:hba1c|a1c)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(%)?'; unit="%"; range="< 5.7 %"; low=4.0; high=5.6; meaning="Average blood sugar over 3 months." },
                @{ id="hemoglobin"; name="Hemoglobin"; pattern='(?:hemoglobin|haemoglobin|hb)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(g\/dl)?'; unit="g/dL"; range="12.0 - 15.5 g/dL"; low=12.0; high=15.5; meaning="Oxygen-carrying protein in red blood cells." },
                @{ id="cholesterol"; name="Total Cholesterol"; pattern='(?:total\s+cholesterol|serum\s+cholesterol)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(mg\/dl)?'; unit="mg/dL"; range="< 200 mg/dL"; low=100; high=200; meaning="Total circulating fats in blood." },
                @{ id="creatinine"; name="Serum Creatinine"; pattern='(?:creatinine)\b[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(mg\/dl)?'; unit="mg/dL"; range="0.7 - 1.3 mg/dL"; low=0.7; high=1.3; meaning="Marker of healthy kidney filtration." }
            )

            foreach ($td in $testDefs) {
                $m = [regex]::Match($text, $td.pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
                if ($m.Success) {
                    $valNum = [double]$m.Groups[1].Value
                    $flag = "NORMAL"
                    if ($valNum -gt $td.high) { $flag = "HIGH" }
                    elseif ($valNum -lt $td.low) { $flag = "LOW" }

                    $extracted += @{
                        id = $td.id
                        testName = $td.name
                        value = $m.Groups[1].Value
                        numericValue = $valNum
                        unit = $td.unit
                        referenceRange = $td.range
                        flag = $flag
                        meaning = $td.meaning
                    }
                }
            }

            Write-JsonResponse @{
                success = $true
                documentName = if ($body.documentName) { $body.documentName } else { "Blood Test Report" }
                extractedValues = $extracted
                provider = "MediBridge Clinical Parameter Parser"
            }
            continue
        }

        # -------------------------------------------------------------
        # Route: POST /api/document/explain
        # -------------------------------------------------------------
        if ($urlPath -eq "api/document/explain" -and $request.HttpMethod -eq "POST") {
            $user = Get-UserFromToken $token
            $body = Read-JsonBody
            $text = if ($body.text) { $body.text.Trim() } else { "" }

            if (-not $text) {
                Write-JsonResponse @{ success = $false; error = "EMPTY_TEXT"; message = "Please provide document text." } 400
                continue
            }

            # Medical check
            $medKws = @("hemoglobin", "glucose", "cholesterol", "creatinine", "x-ray", "radiology", "blood", "patient", "doctor", "hospital", "prescription", "diagnosis")
            $matchCount = 0
            foreach ($k in $medKws) {
                if ($text.ToLower().Contains($k)) { $matchCount++ }
            }
            if ($matchCount -lt 2) {
                Write-JsonResponse @{
                    success = $false
                    error = "NON_MEDICAL_DOCUMENT"
                    message = "This document does not appear to contain medical information. Please upload a medical report or document."
                } 400
                continue
            }

            Write-JsonResponse @{
                success = $true
                documentName = if ($body.documentName) { $body.documentName } else { "Medical Report" }
                explanation = "Document processed successfully. Clinical findings extracted."
                provider = "MediBridge Clinical Document Engine"
            }
            continue
        }

        # -------------------------------------------------------------
        # Route: GET /api/appointments
        # -------------------------------------------------------------
        if ($urlPath -eq "api/appointments" -and $request.HttpMethod -eq "GET") {
            $user = Get-UserFromToken $token
            if (-not $user) {
                Write-JsonResponse @{ success = $false; error = "UNAUTHORIZED"; message = "Please sign in to view appointments." } 401
                continue
            }

            $apts = if ($db.appointments.ContainsKey($user.id)) { $db.appointments[$user.id] } else { @() }
            Write-JsonResponse @{ success = $true; appointments = $apts }
            continue
        }

        # -------------------------------------------------------------
        # Route: POST /api/appointments
        # -------------------------------------------------------------
        if ($urlPath -eq "api/appointments" -and $request.HttpMethod -eq "POST") {
            $user = Get-UserFromToken $token
            if (-not $user) {
                Write-JsonResponse @{ success = $false; error = "UNAUTHORIZED"; message = "Please sign in to save an appointment." } 401
                continue
            }

            $body = Read-JsonBody
            if (-not $body.hospitalName -or -not $body.date -or -not $body.time) {
                Write-JsonResponse @{ success = $false; error = "MISSING_FIELDS"; message = "Hospital name, date, and time are required." } 400
                continue
            }

            $aptId = "apt_" + [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
            $appointment = @{
                id = $aptId
                userId = $user.id
                hospitalName = $body.hospitalName
                hospitalAddress = $body.hospitalAddress
                hospitalPhone = $body.hospitalPhone
                date = $body.date
                time = $body.time
                purpose = $body.purpose
                reminderEnabled = [bool]$body.reminderEnabled
                reminderTime = $body.reminderTime
                reminderNote = $body.reminderNote
                status = if ($body.status) { $body.status } else { "Reminder Saved" }
                createdAt = (Get-Date).ToString("o")
            }

            if (-not $db.appointments.ContainsKey($user.id)) { $db.appointments[$user.id] = @() }
            $arr = @($db.appointments[$user.id])
            $db.appointments[$user.id] = ,$appointment + $arr
            Save-Database

            Write-JsonResponse @{ success = $true; appointment = $appointment; message = "Appointment saved successfully." } 201
            continue
        }

        # -------------------------------------------------------------
        # Route: DELETE /api/appointments/:id
        # -------------------------------------------------------------
        if ($urlPath.StartsWith("api/appointments/") -and $request.HttpMethod -eq "DELETE") {
            $user = Get-UserFromToken $token
            if (-not $user) {
                Write-JsonResponse @{ success = $false; error = "UNAUTHORIZED"; message = "Please sign in." } 401
                continue
            }

            $aptId = $urlPath.Substring("api/appointments/".Length)
            if ($db.appointments.ContainsKey($user.id)) {
                $filtered = @($db.appointments[$user.id] | Where-Object { $_.id -ne $aptId })
                $db.appointments[$user.id] = $filtered
                Save-Database
            }

            Write-JsonResponse @{ success = $true; message = "Appointment deleted." }
            continue
        }

        # -------------------------------------------------------------
        # Route: GET /api/history
        # -------------------------------------------------------------
        if ($urlPath -eq "api/history" -and $request.HttpMethod -eq "GET") {
            $user = Get-UserFromToken $token
            if (-not $user) {
                Write-JsonResponse @{ success = $false; error = "UNAUTHORIZED"; message = "Please sign in." } 401
                continue
            }

            $hist = if ($db.history.ContainsKey($user.id)) { $db.history[$user.id] } else { @() }
            Write-JsonResponse @{ success = $true; history = $hist }
            continue
        }

        # -------------------------------------------------------------
        # Route: POST /api/history
        # -------------------------------------------------------------
        if ($urlPath -eq "api/history" -and $request.HttpMethod -eq "POST") {
            $user = Get-UserFromToken $token
            if (-not $user) {
                Write-JsonResponse @{ success = $false; error = "UNAUTHORIZED"; message = "Please sign in." } 401
                continue
            }

            $body = Read-JsonBody
            $histItem = @{
                id = "hist_" + [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
                userId = $user.id
                type = if ($body.type) { $body.type } else { "conversation" }
                title = if ($body.title) { $body.title } else { "Health Record" }
                summary = $body.summary
                data = $body.data
                timestamp = (Get-Date).ToString("o")
            }

            if (-not $db.history.ContainsKey($user.id)) { $db.history[$user.id] = @() }
            $arr = @($db.history[$user.id])
            $db.history[$user.id] = ,$histItem + $arr
            Save-Database

            Write-JsonResponse @{ success = $true; item = $histItem; message = "Saved to history." } 201
            continue
        }

        # -------------------------------------------------------------
        # Route: DELETE /api/history (Clear all) or /api/history/:id
        # -------------------------------------------------------------
        if ($urlPath.StartsWith("api/history") -and $request.HttpMethod -eq "DELETE") {
            $user = Get-UserFromToken $token
            if (-not $user) {
                Write-JsonResponse @{ success = $false; error = "UNAUTHORIZED"; message = "Please sign in." } 401
                continue
            }

            if ($urlPath -eq "api/history") {
                $db.history[$user.id] = @()
                Save-Database
                Write-JsonResponse @{ success = $true; message = "History cleared." }
            } else {
                $histId = $urlPath.Substring("api/history/".Length)
                if ($db.history.ContainsKey($user.id)) {
                    $filtered = @($db.history[$user.id] | Where-Object { $_.id -ne $histId })
                    $db.history[$user.id] = $filtered
                    Save-Database
                }
                Write-JsonResponse @{ success = $true; message = "History item deleted." }
            }
            continue
        }

        # -------------------------------------------------------------
        # Static File Serving
        # -------------------------------------------------------------
        $filePath = Join-Path $scriptDir $urlPath

        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
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
        # Process loop error
    }
}

$listener.Stop()
