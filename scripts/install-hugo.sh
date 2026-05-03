#!/usr/bin/env bash
set -euo pipefail

# Install a pinned version of Hugo locally under .tools/hugo/.
# Reads version from .hugo-version. Verifies SHA256 before extraction.
# No sudo, no global install.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
VERSION_FILE="${PROJECT_ROOT}/.hugo-version"
TOOLS_DIR="${PROJECT_ROOT}/.tools/hugo"
BIN_DIR="${TOOLS_DIR}/bin"
HUGO_BIN="${BIN_DIR}/hugo"

if [[ ! -f "${VERSION_FILE}" ]]; then
  echo "error: ${VERSION_FILE} not found" >&2
  exit 1
fi

HUGO_VERSION="$(tr -d '[:space:]' < "${VERSION_FILE}")"
if [[ -z "${HUGO_VERSION}" ]]; then
  echo "error: .hugo-version is empty" >&2
  exit 1
fi

# Idempotency: skip if already installed at the right version.
if [[ -x "${HUGO_BIN}" ]]; then
  if "${HUGO_BIN}" version 2>/dev/null | grep -q "v${HUGO_VERSION}"; then
    echo "hugo v${HUGO_VERSION} already installed at ${HUGO_BIN}"
    exit 0
  fi
fi

OS="$(uname -s)"
ARCH="$(uname -m)"

case "${OS}" in
  Darwin)
    ASSET="hugo_extended_${HUGO_VERSION}_darwin-universal.pkg"
    KIND="pkg"
    ;;
  Linux)
    case "${ARCH}" in
      x86_64)
        ASSET="hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"
        ;;
      arm64|aarch64)
        ASSET="hugo_extended_${HUGO_VERSION}_linux-arm64.tar.gz"
        ;;
      *)
        echo "error: unsupported Linux arch: ${ARCH}" >&2
        exit 1
        ;;
    esac
    KIND="tar"
    ;;
  *)
    echo "error: unsupported OS: ${OS}" >&2
    exit 1
    ;;
esac

CHECKSUMS="hugo_${HUGO_VERSION}_checksums.txt"
BASE_URL="https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}"

mkdir -p "${TOOLS_DIR}" "${BIN_DIR}"
DOWNLOAD_DIR="${TOOLS_DIR}/download"
mkdir -p "${DOWNLOAD_DIR}"

ASSET_PATH="${DOWNLOAD_DIR}/${ASSET}"
CHECKSUMS_PATH="${DOWNLOAD_DIR}/${CHECKSUMS}"

echo "downloading ${ASSET}"
curl -fsSL -o "${ASSET_PATH}" "${BASE_URL}/${ASSET}"
echo "downloading ${CHECKSUMS}"
curl -fsSL -o "${CHECKSUMS_PATH}" "${BASE_URL}/${CHECKSUMS}"

# Pick a sha256 tool.
if command -v sha256sum >/dev/null 2>&1; then
  SHA_CMD="sha256sum"
elif command -v shasum >/dev/null 2>&1; then
  SHA_CMD="shasum -a 256"
else
  echo "error: neither sha256sum nor shasum found" >&2
  exit 1
fi

ACTUAL_HASH="$(${SHA_CMD} "${ASSET_PATH}" | awk '{print $1}')"
EXPECTED_HASH="$(awk -v f="${ASSET}" '$2 == f {print $1}' "${CHECKSUMS_PATH}")"

if [[ -z "${EXPECTED_HASH}" ]]; then
  echo "error: ${ASSET} not found in ${CHECKSUMS}" >&2
  exit 1
fi

if [[ "${ACTUAL_HASH}" != "${EXPECTED_HASH}" ]]; then
  echo "error: SHA256 mismatch for ${ASSET}" >&2
  echo "  expected: ${EXPECTED_HASH}" >&2
  echo "  actual:   ${ACTUAL_HASH}" >&2
  exit 1
fi
echo "checksum verified"

EXTRACT_DIR="${TOOLS_DIR}/extracted"
rm -rf "${EXTRACT_DIR}"
mkdir -p "${EXTRACT_DIR}"

case "${KIND}" in
  pkg)
    if ! command -v pkgutil >/dev/null 2>&1; then
      echo "error: pkgutil not available (required on macOS)" >&2
      exit 1
    fi
    # pkgutil --expand-full requires the destination to NOT exist.
    PKG_EXPAND="${EXTRACT_DIR}/pkg"
    rm -rf "${PKG_EXPAND}"
    pkgutil --expand-full "${ASSET_PATH}" "${PKG_EXPAND}"
    # The pkg layout has changed across Hugo releases. Try usr/local/bin first,
    # then fall back to any executable file named "hugo" inside the payload.
    SRC_BIN="$(find "${PKG_EXPAND}" -type f -path '*/usr/local/bin/hugo' -print -quit 2>/dev/null || true)"
    if [[ -z "${SRC_BIN}" ]]; then
      SRC_BIN="$(find "${PKG_EXPAND}" -type f -name hugo -print -quit 2>/dev/null || true)"
    fi
    if [[ -z "${SRC_BIN}" ]]; then
      echo "error: hugo binary not found in expanded pkg" >&2
      exit 1
    fi
    cp "${SRC_BIN}" "${HUGO_BIN}"
    ;;
  tar)
    tar -xzf "${ASSET_PATH}" -C "${EXTRACT_DIR}"
    if [[ ! -f "${EXTRACT_DIR}/hugo" ]]; then
      echo "error: hugo binary not found in tarball" >&2
      exit 1
    fi
    cp "${EXTRACT_DIR}/hugo" "${HUGO_BIN}"
    ;;
esac

chmod +x "${HUGO_BIN}"

if ! "${HUGO_BIN}" version | grep -q "v${HUGO_VERSION}"; then
  echo "error: installed hugo does not report v${HUGO_VERSION}" >&2
  "${HUGO_BIN}" version >&2 || true
  exit 1
fi

echo "installed hugo v${HUGO_VERSION} -> ${HUGO_BIN}"
