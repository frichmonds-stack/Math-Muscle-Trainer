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
$appFiles = @("index.html") +
  @(Get-ChildItem -Path (Join-Path $RepoRoot "css") -Filter "*.css" -File | Sort-Object Name | ForEach-Object { "css/$($_.Name)" }) +
  @(Get-ChildItem -Path (Join-Path $RepoRoot "js") -Filter "*.js" -File | Sort-Object Name | ForEach-Object { "js/$($_.Name)" })
foreach ($folder in @("css", "js")) {
  $targetFolder = Join-Path $target $folder
  if (!(Test-Path -LiteralPath $targetFolder)) {
    New-Item -ItemType Directory -Path $targetFolder | Out-Null
  }
}
Get-ChildItem -Path (Join-Path $target "css") -Filter "*.css" -File | Remove-Item
$legacyStyles = Join-Path $target "styles.css"
if (Test-Path -LiteralPath $legacyStyles) {
  Remove-Item -LiteralPath $legacyStyles
}
foreach ($relativePath in $appFiles) {
  Copy-Item -LiteralPath (Join-Path $RepoRoot $relativePath) -Destination (Join-Path $target $relativePath) -Force
}

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
