param(
  [string] $Label = ""
)

$ErrorActionPreference = "Stop"
$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function Read-Utf8Text {
  param([string] $Path)
  return [System.Text.Encoding]::UTF8.GetString([System.IO.File]::ReadAllBytes((Join-Path $RepoRoot $Path)))
}

function Write-Utf8Text {
  param(
    [string] $Path,
    [string] $Text
  )
  [System.IO.File]::WriteAllText((Join-Path $RepoRoot $Path), $Text, $Utf8NoBom)
}

function Get-AppVersion {
  $core = Read-Utf8Text "js/app-core.js"
  $match = [regex]::Match($core, 'const\s+APP_VERSION\s*=\s*"(v?\d+\.\d+\.\d+)"')
  if (!$match.Success) {
    throw "Could not find APP_VERSION in js/app-core.js."
  }
  $version = $match.Groups[1].Value
  if ($version.StartsWith("v")) {
    return $version
  }
  return "v$version"
}

$targetRelative = "docs/live"
$target = Join-Path $RepoRoot $targetRelative
if (!(Test-Path -LiteralPath $target)) {
  New-Item -ItemType Directory -Path $target | Out-Null
}
if (!(Test-Path -LiteralPath (Join-Path $target "js"))) {
  New-Item -ItemType Directory -Path (Join-Path $target "js") | Out-Null
}

Copy-Item -LiteralPath (Join-Path $RepoRoot "index.html") -Destination (Join-Path $target "index.html") -Force
Copy-Item -LiteralPath (Join-Path $RepoRoot "styles.css") -Destination (Join-Path $target "styles.css") -Force
Copy-Item -LiteralPath (Join-Path $RepoRoot "js/app-core.js") -Destination (Join-Path $target "js/app-core.js") -Force
Copy-Item -LiteralPath (Join-Path $RepoRoot "js/app-init.js") -Destination (Join-Path $target "js/app-init.js") -Force
Copy-Item -LiteralPath (Join-Path $RepoRoot "js/app-practice.js") -Destination (Join-Path $target "js/app-practice.js") -Force
Copy-Item -LiteralPath (Join-Path $RepoRoot "js/app-progress.js") -Destination (Join-Path $target "js/app-progress.js") -Force
Copy-Item -LiteralPath (Join-Path $RepoRoot "js/app-techniques.js") -Destination (Join-Path $target "js/app-techniques.js") -Force

$docsIndex = Read-Utf8Text "docs/index.html"
$existingLabels = @{}
[regex]::Matches($docsIndex, '<li><a href="\./(v\d+)/">([^<]+)</a></li>') | ForEach-Object {
  $existingLabels[$_.Groups[1].Value] = ($_.Groups[2].Value -replace '\s*\(latest\)', '').Trim()
}

$appVersion = Get-AppVersion
$liveLabel = if ($Label.Trim()) {
  "Live - $($Label.Trim())"
} else {
  "Live - $appVersion current build"
}

$versionDirs = Get-ChildItem -Path (Join-Path $RepoRoot "docs") -Directory |
  Where-Object { $_.Name -match '^v(\d+)$' } |
  Sort-Object { [int]($_.Name.Substring(1)) } -Descending

$snapshotItems = $versionDirs | ForEach-Object {
  $name = $_.Name
  $number = [int]$name.Substring(1)
  $text = if ($existingLabels.ContainsKey($name)) {
    $existingLabels[$name]
  } else {
    "Version $number"
  }
  "    <li><a href=""./$name/"">$text</a></li>"
}

$nextIndex = @"
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Math Muscle Trainer Versions</title>
</head>
<body>
  <h1>Math Muscle Trainer Versions</h1>
  <h2>Current Live Build</h2>
  <ul>
    <li><a href="./live/">$liveLabel (latest)</a></li>
  </ul>
  <h2>Preserved Snapshots</h2>
  <ul>
$($snapshotItems -join "`r`n")
  </ul>
</body>
</html>
"@

Write-Utf8Text "docs/index.html" $nextIndex
Write-Host "Published $targetRelative and updated docs/index.html." -ForegroundColor Green
