$ErrorActionPreference = "Stop"

$script:Failures = @()
$RepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$Utf8 = [System.Text.Encoding]::UTF8

function Add-Failure {
  param([string] $Message)
  $script:Failures += $Message
  Write-Host "FAIL $Message" -ForegroundColor Red
}

function Read-Utf8Text {
  param([string] $Path)
  return $Utf8.GetString([System.IO.File]::ReadAllBytes((Join-Path $RepoRoot $Path)))
}

function Get-AppVersion {
  $core = Read-Utf8Text "js/app-core.js"
  $match = [regex]::Match($core, 'const\s+APP_VERSION\s*=\s*"v?(\d+\.\d+\.\d+)"')
  if (!$match.Success) {
    Add-Failure "Could not find APP_VERSION in js/app-core.js."
    return $null
  }
  return $match.Groups[1].Value
}

Push-Location $RepoRoot
try {
  $idMatches = Select-String -Path "index.html" -Pattern 'id="([^"]+)"' -AllMatches |
    ForEach-Object {
      foreach ($match in $_.Matches) {
        [PSCustomObject]@{
          Id = $match.Groups[1].Value
          Line = $_.LineNumber
        }
      }
    }
  $duplicateIds = $idMatches | Group-Object Id | Where-Object { $_.Count -gt 1 }
  foreach ($duplicate in $duplicateIds) {
    $lines = ($duplicate.Group | ForEach-Object Line) -join ", "
    Add-Failure "Duplicate id '$($duplicate.Name)' in index.html on lines $lines."
  }

  $scriptRefs = Select-String -Path "index.html" -Pattern '<script src="([^"]+)"' -AllMatches |
    ForEach-Object {
      foreach ($match in $_.Matches) {
        $match.Groups[1].Value
      }
    }
  foreach ($scriptRef in $scriptRefs) {
    if (!(Test-Path -LiteralPath (Join-Path $RepoRoot $scriptRef))) {
      Add-Failure "Missing script referenced from index.html: $scriptRef."
    }
  }

  $removedHelpers = @("applySettingsToForm")
  foreach ($helper in $removedHelpers) {
    $hits = Select-String -Path "js/*.js" -Pattern "\b$helper\s*\("
    if ($hits) {
      Add-Failure "Removed helper still referenced: $helper."
    }
  }

  $jsFiles = Get-ChildItem -Path "js" -Filter "*.js" -File
  $jsText = ($jsFiles | ForEach-Object { Read-Utf8Text $_.FullName.Substring($RepoRoot.Path.Length + 1) }) -join "`n"
  $functionNames = [regex]::Matches($jsText, '(?m)^\s*function\s+([A-Za-z_$][\w$]*)\s*\(') |
    ForEach-Object { $_.Groups[1].Value } |
    Sort-Object -Unique
  $projectCallNames = [regex]::Matches($jsText, '(?<![.\w$])([A-Za-z_$][\w$]*)\s*\(') |
    ForEach-Object { $_.Groups[1].Value } |
    Where-Object {
      $_ -cmatch '^(apply|render|start|handle|get|set|sync|reset|create|build|update|format|normalise|sanitise|read|show|open|close|request|toggle|shift|load|save|queue|complete|register|infer|parse|calculate|compare|compact|prune|mark|advance|retreat|jump|begin|move|submit|evaluate|randomise|append|write)'
    } |
    Sort-Object -Unique
  $undefinedProjectCalls = $projectCallNames | Where-Object { $functionNames -notcontains $_ }
  if ($undefinedProjectCalls) {
    Add-Failure "Possible undefined project function call(s): $($undefinedProjectCalls -join ', ')."
  }

  $appVersion = Get-AppVersion
  $changelog = Read-Utf8Text "CHANGELOG.md"
  $releasedVersions = [regex]::Matches($changelog, '(?m)^## \[(\d+\.\d+\.\d+)\]') |
    ForEach-Object { $_.Groups[1].Value }
  if (!$releasedVersions.Count) {
    Add-Failure "CHANGELOG.md has no released semantic version headings."
  } elseif ($appVersion) {
    $latestChangelogVersion = $releasedVersions | Sort-Object { [version]$_ } | Select-Object -Last 1
    if ($appVersion -ne $latestChangelogVersion) {
      Add-Failure "APP_VERSION v$appVersion does not match latest CHANGELOG release v$latestChangelogVersion."
    }
  }

  $docsIndexPath = Join-Path $RepoRoot "docs/index.html"
  if (Test-Path -LiteralPath $docsIndexPath) {
    $docsIndex = Read-Utf8Text "docs/index.html"
    $latestCount = [regex]::Matches($docsIndex, '\(latest\)').Count
    if ($latestCount -ne 1) {
      Add-Failure "docs/index.html should contain exactly one '(latest)' marker, found $latestCount."
    }

    $versionDirs = Get-ChildItem -Path "docs" -Directory |
      Where-Object { $_.Name -match '^v(\d+)$' } |
      Sort-Object { [int]($_.Name.Substring(1)) }
    $liveDir = Join-Path $RepoRoot "docs/live"
    $latestLiveLink = [regex]::Match($docsIndex, '<a href="\./live/">[^<]*\(latest\)')
    $latestVersionLink = [regex]::Match($docsIndex, '<a href="\./(v\d+)/">[^<]*\(latest\)')

    if ($versionDirs.Count) {
      $latestDir = $versionDirs | Select-Object -Last 1
      if ($latestVersionLink.Success -and $latestVersionLink.Groups[1].Value -ne $latestDir.Name) {
        Add-Failure "docs latest version marker points to $($latestVersionLink.Groups[1].Value), expected $($latestDir.Name)."
      }
    }

    $latestDir = $null
    if ($latestLiveLink.Success) {
      if (!(Test-Path -LiteralPath $liveDir)) {
        Add-Failure "docs/index.html marks live as latest but docs/live is missing."
      } else {
        $latestDir = Get-Item -LiteralPath $liveDir
      }
    } elseif ($latestVersionLink.Success -and $versionDirs.Count) {
      $latestDir = $versionDirs | Where-Object { $_.Name -eq $latestVersionLink.Groups[1].Value } | Select-Object -First 1
    } else {
      Add-Failure "docs/index.html does not mark live or a version link as latest."
    }

    if ($latestDir) {
      $rootFiles = @(
        "index.html",
        "styles.css",
        "js/app-core.js",
        "js/app-init.js",
        "js/app-practice.js",
        "js/app-progress.js",
        "js/app-techniques.js"
      )
      foreach ($relativePath in $rootFiles) {
        $rootFile = Join-Path $RepoRoot $relativePath
        $docsFile = Join-Path $latestDir.FullName $relativePath
        if (!(Test-Path -LiteralPath $docsFile)) {
          Add-Failure "Latest docs snapshot is missing $relativePath."
          continue
        }
        $rootHash = (Get-FileHash -LiteralPath $rootFile -Algorithm SHA256).Hash
        $docsHash = (Get-FileHash -LiteralPath $docsFile -Algorithm SHA256).Hash
        if ($rootHash -ne $docsHash) {
          Add-Failure "Latest docs snapshot differs from root for $relativePath."
        }
      }
    }
  }
} finally {
  Pop-Location
}

if ($script:Failures.Count) {
  Write-Host ""
  Write-Host "$($script:Failures.Count) check(s) failed." -ForegroundColor Red
  exit 1
}

Write-Host "All repo checks passed." -ForegroundColor Green
