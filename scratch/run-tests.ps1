# ==============================================================================
# MediBridge AI - Automated 20-Case Medical Simplifier Verification Suite
# ==============================================================================

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) {
    Write-Host "Microsoft Edge not found at standard path: $edgePath" -ForegroundColor Red
    exit 1
}

$testHtml = "file:///d:/Anagha/medibridge-ai/scratch/test-runner.html"
$outputFile = "d:\Anagha\medibridge-ai\scratch\test-dom.html"

if (Test-Path $outputFile) {
    Remove-Item $outputFile -Force
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   Running MediBridge AI Medical Simplifier Test Suite    " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Target: $testHtml" -ForegroundColor Gray
Write-Host "Engine: Microsoft Edge Headless (Chromium)" -ForegroundColor Gray

$args = @(
    "--headless=new",
    "--disable-gpu",
    "--allow-file-access-from-files",
    "--virtual-time-budget=8000",
    "--dump-dom",
    $testHtml
)

$process = Start-Process -FilePath $edgePath -ArgumentList $args -NoNewWindow -PassThru -RedirectStandardOutput $outputFile -RedirectStandardError "d:\Anagha\medibridge-ai\scratch\edge-err.log"
$process.WaitForExit()

Start-Sleep -Milliseconds 500

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
        Write-Host "      $detail" -ForegroundColor DarkGray
    } else {
        $failCount++
        Write-Host "FAIL: $name" -ForegroundColor Red
        Write-Host "      $detail" -ForegroundColor Yellow
    }
}

Write-Host "`n==========================================================" -ForegroundColor Cyan
if ($failCount -eq 0 -and $passCount -ge 20) {
    Write-Host "   RESULT: 100% PASS - ALL $passCount TESTS PASSED ACCURATELY!   " -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Cyan
    exit 0
} else {
    Write-Host "   RESULT: $passCount Passed, $failCount Failed               " -ForegroundColor Red
    Write-Host "==========================================================" -ForegroundColor Cyan
    exit 1
}
