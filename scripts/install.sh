#!/bin/bash
set -euo pipefail

VERSION="${1:-latest}"
INSTALL_DIR="${INSTALL_DIR:-$HOME/.prismcode}"
REPO_URL="https://github.com/j4633705-cloud/Prismcode"

# Detect OS and architecture
OS="$(uname -s | tr '[:upper:]' '[:lower:]')"
ARCH="$(uname -m)"

case "$ARCH" in
  x86_64 | amd64) ARCH="x64" ;;
  aarch64 | arm64) ARCH="arm64" ;;
  *) echo "Unsupported architecture: $ARCH"; exit 1 ;;
esac

case "$OS" in
  linux | darwin) ;;
  *) echo "Unsupported OS: $OS"; exit 1 ;;
esac

echo "Installing Prismcode v$VERSION for $OS/$ARCH..."

mkdir -p "$INSTALL_DIR"

# Determine download URL
if [ "$VERSION" = "latest" ]; then
  if [ "$OS" = "darwin" ]; then
    DOWNLOAD_URL="$REPO_URL/releases/latest/download/prismcode-darwin-x64"
  else
    DOWNLOAD_URL="$REPO_URL/releases/latest/download/prismcode-linux-x64"
  fi
else
  if [ "$OS" = "darwin" ]; then
    DOWNLOAD_URL="$REPO_URL/releases/download/v$VERSION/prismcode-darwin-x64"
  else
    DOWNLOAD_URL="$REPO_URL/releases/download/v$VERSION/prismcode-linux-x64"
  fi
fi

BINARY_PATH="$INSTALL_DIR/prismcode"

echo "Downloading from $DOWNLOAD_URL ..."
if command -v curl &>/dev/null; then
  curl -fsSL "$DOWNLOAD_URL" -o "$BINARY_PATH"
elif command -v wget &>/dev/null; then
  wget -q "$DOWNLOAD_URL" -O "$BINARY_PATH"
else
  echo "Error: need curl or wget"
  exit 1
fi

chmod +x "$BINARY_PATH"

# Add to PATH
if [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
  SHELL_CONFIG=""
  case "$SHELL" in
    */zsh) SHELL_CONFIG="$HOME/.zshrc" ;;
    */bash) SHELL_CONFIG="$HOME/.bashrc" ;;
  esac

  if [ -n "$SHELL_CONFIG" ]; then
    echo "" >> "$SHELL_CONFIG"
    echo "# Prismcode" >> "$SHELL_CONFIG"
    echo "export PATH=\"\$PATH:$INSTALL_DIR\"" >> "$SHELL_CONFIG"
    echo "Added $INSTALL_DIR to PATH in $SHELL_CONFIG"
  fi
fi

echo ""
echo "Prismcode installed successfully!"
echo "Run 'prismcode' in your project directory to start."
echo ""
echo "Or log in to the cloud service:"
echo "  prismcode login"
