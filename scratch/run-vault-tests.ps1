# ==============================================================================
# MediBridge AI - Personal Medical Vault Verification Runner
# ==============================================================================

$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) {
    Write-Host "Microsoft Edge not found at standard path: $edgePath" -ForegroundColor Red
    exit 1
}

$testHtml = "file:///d:/Anagha/medibridge-ai/scratch/vault-tests.html"
$outputFile = "d:\Anagha\medibridge-ai\scratch\vault-test-dom.html"

if (Test-Path $outputFile) {
    Remove-Item $outputFile -Force
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "    Running MediBridge AI Personal Medical Vault Suite    " -ForegroundColor Green
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

$process = Start-Process -FilePath $edgePath -ArgumentList $args -NoNewWindow -PassThru -RedirectStandardOutput $outputFile -RedirectStandardError "d:\Anagha\medibridge-ai\scratch\vault-edge-err.log"
$process.WaitForExit()

Start-Sleep -Milliseconds 500

if (-not (Test-Path $outputFile)) {
    Write-Host "Error: Test output file was not created by Edge." -ForegroundColor Red
    exit 1
}

$dom = Get-Content $outputFile -Raw

# Check passes and fails in DOM
$passMatches = [regex]::Matches($dom, '\[PASS\]')
$failMatches = [regex]::Matches($dom, '\[FAIL\]')

$failColor = if ($failMatches.Count -gt 0) { "Red" } else { "Gray" }

Write-Host ""
Write-Host "=== TEST EXECUTION RESULTS ===" -ForegroundColor Cyan
Write-Host "Passed assertions: $($passMatches.Count)" -ForegroundColor Green
Write-Host "Failed assertions: $($failMatches.Count)" -ForegroundColor $failColor

# Output each line
$lineMatches = [regex]::Matches($dom, '\[(PASS|FAIL)\] [^<]+')
foreach ($lm in $lineMatches) {
    $t = $lm.Value.Trim()
    if ($t.StartsWith("[PASS]")) {
        Write-Host $t -ForegroundColor Green
    } else {
        Write-Host $t -ForegroundColor Red
    }
}

if ($failMatches.Count -eq 0 -and $passMatches.Count -ge 15) {
    Write-Host ""
    Write-Host "SUCCESS: 100% PASS - ALL PERSONAL MEDICAL VAULT TESTS PASSED ACCURATELY!" -ForegroundColor Green
    exit 0
} else {
    Write-Host ""
    Write-Host "FAILURE: Some tests did not pass." -ForegroundColor Red
    exit 1
}
