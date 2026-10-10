# ==============================================================================
# MediBridge AI - Backend API Integration Test Suite
# Tests all REST endpoints of the native PowerShell backend server
# ==============================================================================

$port = 8085
$prefix = "http://localhost:$port/"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$serverScript = Join-Path (Split-Path -Parent $scriptDir) "start-server.ps1"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "       Starting MediBridge AI Backend API Test Suite      " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

# Launch server process in background on test port
$serverLog = Join-Path $scriptDir "server-test.log"
$serverProc = Start-Process powershell -ArgumentList "-ExecutionPolicy Bypass -File `"$serverScript`" -port $port -noBrowser" -PassThru -WindowStyle Hidden -RedirectStandardOutput $serverLog -RedirectStandardError (Join-Path $scriptDir "server-test-err.log")

# Wait for server to be responsive
$ready = $false
for ($i = 0; $i -lt 10; $i++) {
    Start-Sleep -Milliseconds 600
    try {
        $testRes = Invoke-RestMethod -Uri "${prefix}api/health" -Method Get -TimeoutSec 1
        if ($testRes.status -eq "ok") {
            $ready = $true
            break
        }
    } catch {}
}

if (-not $ready) {
    Write-Host "Server failed to start on $prefix within timeout." -ForegroundColor Red
    if (Test-Path (Join-Path $scriptDir "server-test-err.log")) {
        Get-Content (Join-Path $scriptDir "server-test-err.log")
    }
}

$passed = 0
$failed = 0

function Assert-Test($name, $scriptBlock) {
    try {
        & $scriptBlock
        Write-Host "PASS: $name" -ForegroundColor Green
        $script:passed++
    } catch {
        Write-Host "FAIL: $name - $($_.Exception.Message)" -ForegroundColor Red
        $script:failed++
    }
}

try {
    # 1. Health check
    Assert-Test "GET /api/health" {
        $res = Invoke-RestMethod -Uri "${prefix}api/health" -Method Get
        if ($res.status -ne "ok") { throw "Status was not ok" }
        if (-not $res.server) { throw "Missing server field" }
    }

    # 2. Auth login validation (invalid mobile)
    Assert-Test "POST /api/auth/login rejects invalid mobile" {
        $body = @{ name = "Test User"; mobile = "12345" } | ConvertTo-Json
        try {
            Invoke-RestMethod -Uri "${prefix}api/auth/login" -Method Post -Body $body -ContentType "application/json"
            throw "Expected error 400 for invalid mobile"
        } catch {
            if ($_.Exception.Response.StatusCode.value__ -ne 400) { throw "Expected 400, got $($_.Exception.Response.StatusCode.value__)" }
        }
    }

    # 3. Auth login success
    $token = $null
    Assert-Test "POST /api/auth/login creates session token" {
        $body = @{ name = "Anagha Student"; mobile = "9876543210" } | ConvertTo-Json
        $res = Invoke-RestMethod -Uri "${prefix}api/auth/login" -Method Post -Body $body -ContentType "application/json"
        if (-not $res.success -or -not $res.token) { throw "Login failed" }
        $global:token = $res.token
    }

    # 4. Auth /me check
    Assert-Test "GET /api/auth/me with Bearer token" {
        $headers = @{ Authorization = "Bearer $token" }
        $res = Invoke-RestMethod -Uri "${prefix}api/auth/me" -Method Get -Headers $headers
        if (-not $res.success -or $res.user.name -ne "Anagha Student") { throw "User mismatch" }
    }

    # 5. Document Explainer rejects non-medical text
    Assert-Test "POST /api/document/explain rejects non-medical document" {
        $body = @{ text = "The weather today is sunny and mild with clear skies." } | ConvertTo-Json
        try {
            Invoke-RestMethod -Uri "${prefix}api/document/explain" -Method Post -Body $body -ContentType "application/json"
            throw "Expected 400 for non-medical document"
        } catch {
            if ($_.Exception.Response.StatusCode.value__ -ne 400) { throw "Expected 400" }
        }
    }

    # 6. Blood test parameter extraction
    Assert-Test "POST /api/bloodtest extracts parameters" {
        $body = @{ text = "Patient Lab Report:`nFasting Blood Glucose: 118 mg/dL`nHemoglobin: 13.5 g/dL`nTotal Cholesterol: 220 mg/dL" } | ConvertTo-Json
        $res = Invoke-RestMethod -Uri "${prefix}api/bloodtest" -Method Post -Body $body -ContentType "application/json"
        if (-not $res.success -or $res.extractedValues.Count -lt 2) { throw "Extraction failed" }
    }

    # 7. Appointments create
    $aptId = $null
    Assert-Test "POST /api/appointments creates appointment" {
        $futureDate = (Get-Date).AddDays(3).ToString("yyyy-MM-dd")
        $body = @{
            hospitalName = "Victoria Hospital (BMCRI)"
            hospitalAddress = "Fort Road, Bengaluru"
            hospitalPhone = "+91-80-26701150"
            date = $futureDate
            time = "10:30"
            purpose = "Cardiology follow-up"
            reminderEnabled = $true
            reminderTime = "1_hour_before"
            status = "Reminder Saved"
        } | ConvertTo-Json
        $headers = @{ Authorization = "Bearer $token" }
        $res = Invoke-RestMethod -Uri "${prefix}api/appointments" -Method Post -Body $body -ContentType "application/json" -Headers $headers
        if (-not $res.success -or -not $res.appointment.id) { throw "Appointment create failed" }
        $global:aptId = $res.appointment.id
    }

    # 8. Appointments get
    Assert-Test "GET /api/appointments retrieves user appointments" {
        $headers = @{ Authorization = "Bearer $token" }
        $res = Invoke-RestMethod -Uri "${prefix}api/appointments" -Method Get -Headers $headers
        if (-not $res.success -or $res.appointments.Count -eq 0) { throw "No appointments returned" }
    }

    # 9. Appointments delete
    Assert-Test "DELETE /api/appointments/:id deletes appointment" {
        $headers = @{ Authorization = "Bearer $token" }
        $res = Invoke-RestMethod -Uri "${prefix}api/appointments/$aptId" -Method Delete -Headers $headers
        if (-not $res.success) { throw "Delete failed" }
    }

    # 10. AI Chat missing key handling
    Assert-Test "POST /api/chat handles unconfigured key gracefully (503)" {
        $body = @{ message = "What is hypertension?" } | ConvertTo-Json
        try {
            Invoke-RestMethod -Uri "${prefix}api/chat" -Method Post -Body $body -ContentType "application/json"
            # If server has key in env, it might succeed; if not, it returns 503
        } catch {
            if ($_.Exception.Response.StatusCode.value__ -ne 503) { throw "Unexpected status code $($_.Exception.Response.StatusCode.value__)" }
        }
    }

} finally {
    # Stop background test server
    if ($serverProc -and -not $serverProc.HasExited) {
        Stop-Process -Id $serverProc.Id -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   BACKEND API RESULTS: $passed passed, $failed failed    " -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Yellow" })
Write-Host "==========================================================" -ForegroundColor Cyan
