param(
  [string]$BaseUrl = "http://127.0.0.1:5214",
  [string]$ChromePath = "$env:LOCALAPPDATA\ms-playwright\chromium-1248\chrome-win64\chrome.exe",
  [int]$Repeats = 3
)
$ErrorActionPreference = "Stop"
if (([Uri]$BaseUrl).Host -notin @("127.0.0.1", "localhost", "[::1]")) { throw "Loopback candidate only." }
if (-not (Test-Path -LiteralPath $ChromePath)) { throw "Pinned Playwright Chromium executable not found." }
$outputDirectory = Join-Path $PSScriptRoot "lighthouse"
New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null
$targets = @(
  @{ key="home-en"; path="/en"; profile="mobile" },
  @{ key="home-ar"; path="/ar"; profile="mobile" },
  @{ key="contact-en"; path="/en/contact"; profile="mobile" },
  @{ key="contact-ar"; path="/ar/contact"; profile="mobile" },
  @{ key="home-en"; path="/en"; profile="desktop" },
  @{ key="home-ar"; path="/ar"; profile="desktop" }
)
$samples = [System.Collections.Generic.List[object]]::new()
foreach ($target in $targets) {
  for ($iteration = 1; $iteration -le $Repeats; $iteration++) {
    $url = "$($BaseUrl.TrimEnd('/'))$($target.path)"
    $reportName = "lighthouse-$($target.key)-$($target.profile)-$iteration.json"
    $reportPath = Join-Path $outputDirectory $reportName
    $arguments = @("exec", "--yes", "--package=lighthouse@13.5.0", "--", "lighthouse", $url, "--chrome-path=$ChromePath", "--output=json", "--output-path=$reportPath", "--quiet", "--only-categories=performance", "--throttling-method=devtools")
    if ($target.profile -eq "desktop") { $arguments += "--preset=desktop" }
    & npm.cmd @arguments
    if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $reportPath)) { throw "Lighthouse failed for $($target.key) $($target.profile) run $iteration." }
    $report = [IO.File]::ReadAllText($reportPath, [Text.Encoding]::UTF8) | ConvertFrom-Json
    $resources = @($report.audits.'resource-summary'.details.items)
    $samples.Add([PSCustomObject]@{
      route=$target.path; profile=$target.profile; repeat=$iteration; file=$reportName
      lighthouse=$report.lighthouseVersion; chrome=$report.environment.networkUserAgent
      score=$report.categories.performance.score
      lcpMs=$report.audits.'largest-contentful-paint'.numericValue
      fcpMs=$report.audits.'first-contentful-paint'.numericValue
      cls=$report.audits.'cumulative-layout-shift'.numericValue
      tbtMs=$report.audits.'total-blocking-time'.numericValue
      speedIndexMs=$report.audits.'speed-index'.numericValue
      ttfbMs=$report.audits.'server-response-time'.numericValue
      transferBytes=$report.audits.'total-byte-weight'.numericValue
      requestCount=@($report.audits.'network-requests'.details.items).Count
      imageBytes=($resources | Where-Object { $_.resourceType -eq "image" } | Measure-Object transferSize -Sum).Sum
      scriptBytes=($resources | Where-Object { $_.resourceType -eq "script" } | Measure-Object transferSize -Sum).Sum
      fontBytes=($resources | Where-Object { $_.resourceType -eq "font" } | Measure-Object transferSize -Sum).Sum
    })
  }
}
function Get-Median([double[]]$Values) {
  $sorted = @($Values | Sort-Object)
  if ($sorted.Count % 2) { return $sorted[[int]($sorted.Count / 2)] }
  return ($sorted[$sorted.Count / 2 - 1] + $sorted[$sorted.Count / 2]) / 2
}
$groups = @($samples | Group-Object route,profile | ForEach-Object {
  $items = @($_.Group)
  [PSCustomObject]@{
    route=$items[0].route; profile=$items[0].profile; runs=$items.Count
    scoreMedian=(Get-Median @($items.score))
    lcpMedianMs=(Get-Median @($items.lcpMs)); fcpMedianMs=(Get-Median @($items.fcpMs))
    clsMedian=(Get-Median @($items.cls)); tbtMedianMs=(Get-Median @($items.tbtMs))
    speedIndexMedianMs=(Get-Median @($items.speedIndexMs)); ttfbMedianMs=(Get-Median @($items.ttfbMs))
    transferMedianBytes=(Get-Median @($items.transferBytes)); requestMedian=(Get-Median @($items.requestCount))
    imageMedianBytes=(Get-Median @($items.imageBytes)); scriptMedianBytes=(Get-Median @($items.scriptBytes)); fontMedianBytes=(Get-Median @($items.fontBytes))
  }
})
$result = [PSCustomObject]@{
  generatedAt=[DateTime]::UtcNow.ToString("o"); base=$BaseUrl; lighthouse="13.5.0"
  chrome=(Get-Item $ChromePath).VersionInfo.ProductVersion; repeats=$Repeats
  conditions="Local production-mode Docker image; loopback only; Lighthouse mobile/desktop presets with devtools throttling; no field data; database intentionally disconnected; same Lighthouse/Chromium versions and throttling method as Phase 4.2 evidence."
  samples=@($samples); medians=$groups
}
$summaryPath = Join-Path $PSScriptRoot "lighthouse-summary.json"
[IO.File]::WriteAllText($summaryPath, (ConvertTo-Json -InputObject $result -Depth 10), [Text.UTF8Encoding]::new($false))
Write-Output (ConvertTo-Json -InputObject ([PSCustomObject]@{ runs=$samples.Count; summary=$summaryPath; medians=$groups }) -Depth 6 -Compress)
