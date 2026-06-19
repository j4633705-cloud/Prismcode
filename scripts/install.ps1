param(
  [string]$Version = "latest",
  [string]$InstallDir = "$env:LOCALAPPDATA\Prismcode"
)

$ErrorActionPreference = "Stop"
$RepoUrl = "https://github.com/prismcode/prismcode"

# Detect architecture and platform
$Arch = if ([Environment]::Is64BitProcess) { "x64" } else { "x86" }
$Os = "windows"

Write-Host "Installing Prismcode v$Version..." -ForegroundColor Cyan

# Create install directory
New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null

# Determine download URL
if ($Version -eq "latest") {
  $ReleaseUrl = "$RepoUrl/releases/latest/download/prismcode-win-x64.exe"
} else {
  $ReleaseUrl = "$RepoUrl/releases/download/v$Version/prismcode-win-x64.exe"
}

$BinaryPath = Join-Path $InstallDir "prismcode.exe"

# Download binary
Write-Host "Downloading from $ReleaseUrl ..." -ForegroundColor Gray
try {
  $ProgressPreference = 'SilentlyContinue'
  Invoke-WebRequest -Uri $ReleaseUrl -OutFile $BinaryPath -UseBasicParsing
} catch {
  Write-Host "Download failed: $_" -ForegroundColor Red
  Write-Host "Falling back to building from source..." -ForegroundColor Yellow
  & "$PSScriptRoot\build-from-source.ps1"
  exit 1
}

# Add to PATH (User-level)
$UserPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($UserPath -notlike "*$InstallDir*") {
  $NewPath = "$InstallDir;$UserPath"
  [Environment]::SetEnvironmentVariable("Path", $NewPath, "User")
  Write-Host "Added $InstallDir to PATH" -ForegroundColor Green
}

Write-Host "`nPrismcode installed successfully!" -ForegroundColor Green
Write-Host "Run 'prismcode' in your project directory to start." -ForegroundColor Cyan
Write-Host "`nOr log in to the cloud service:" -ForegroundColor Gray
Write-Host "  prismcode login" -ForegroundColor White
