# ==============================================================================
# MediBridge AI - Automated Verification & Test Suite Runner
# Runs full test-runner.html in headless Chromium (Microsoft Edge)
# ==============================================================================

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) {
    $edgePath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}
if (-not (Test-Path $edgePath)) {
    Write-Host "Microsoft Edge not found at standard paths." -ForegroundColor Red
    exit 1
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$testHtml = "file:///" + (Join-Path $scriptDir "test-runner.html").Replace('\', '/')
$outputFile = Join-Path $scriptDir "test-dom.html"
$errLog = Join-Path $scriptDir "edge-err.log"

if (Test-Path $outputFile) {
    Remove-Item $outputFile -Force
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "       Running MediBridge AI Automated Test Suite         " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Target: $testHtml" -ForegroundColor Gray
Write-Host "Engine: Microsoft Edge Headless (Chromium)" -ForegroundColor Gray

$args = @(
    "--headless=new",
    "--disable-gpu",
    "--allow-file-access-from-files",
    "--virtual-time-budget=10000",
    "--dump-dom",
    $testHtml
)

$process = Start-Process -FilePath $edgePath -ArgumentList $args -NoNewWindow -PassThru -RedirectStandardOutput $outputFile -RedirectStandardError $errLog
$process.WaitForExit()

Start-Sleep -Milliseconds 600

if (-not (Test-Path $outputFile)) {
    Write-Host "Error: Test output file was not created by Edge." -ForegroundColor Red
    exit 1
}

$dom = Get-Content $outputFile -Raw

# Extract individual test blocks
$testPattern = '(?s)<div class="test-box (pass|fail)"><strong>(✅|❌) (Test \d+:[^<]+)</strong><pre>([^<]+)</pre></div>'
$matches = [regex]::Matches($dom, $testPattern)

$passCount = 0
$failCount = 0

foreach ($m in $matches) {
    $status = $m.Groups[1].Value
    $icon = $m.Groups[2].Value
    $name = $m.Groups[3].Value.Trim()
    $detail = $m.Groups[4].Value.Trim()

    if ($status -eq "pass") {
        $passCount++
        Write-Host "PASS: $name" -ForegroundColor Green
    } else {
        $failCount++
        Write-Host "FAIL: $name" -ForegroundColor Red
        Write-Host "      Detail: $detail" -ForegroundColor DarkRed
    }
}

Write-Host "==========================================================" -ForegroundColor Cyan
if ($failCount -eq 0 -and $passCount -gt 0) {
    Write-Host "   ALL TESTS PASSED ($passCount passed, 0 failed)         " -ForegroundColor Green
} else {
    Write-Host "   TEST RESULTS: $passCount passed, $failCount failed     " -ForegroundColor Yellow
}
Write-Host "==========================================================" -ForegroundColor Cyan
