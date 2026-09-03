#!/usr/bin/env python3
"""Edit an existing image through the configured Nomiss OpenAI-compatible API."""

from __future__ import annotations

import base64
import json
import mimetypes
import os
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import urllib.request

BASE_URL = "https://nomissapi.top"
ENDPOINT = f"{BASE_URL}/v1/images/edits"
DEFAULT_KEY_FILE = Path.home() / ".codex" / "secrets" / "nomiss-image-api-key"


def get_key() -> str:
    value = os.environ.get("NOMISS_API_KEY", "").strip()
    if not value and os.name == "nt":
        try:
            import winreg
            with winreg.OpenKey(winreg.HKEY_CURRENT_USER, "Environment") as key:
                value = str(winreg.QueryValueEx(key, "NOMISS_API_KEY")[0]).strip()
        except (FileNotFoundError, OSError):
            pass
    if not value:
        value = DEFAULT_KEY_FILE.read_text(encoding="ascii").strip()
    if not value:
        raise RuntimeError("NOMISS_API_KEY is not configured")
    return value


def sanitize(text: str) -> str:
    return re.sub(r"sk-[A-Za-z0-9_-]+", "[REDACTED]", text)


def request(image_path: Path, prompt: str, output_path: Path) -> None:
    curl = shutil.which("curl.exe") or shutil.which("curl")
    if not curl:
        raise RuntimeError("curl is unavailable")
    key = get_key()
    config_path = None
    try:
        with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", suffix=".conf", delete=False) as config:
            config_path = config.name
            config.write(f'header = "Authorization: Bearer {key.replace(chr(92), chr(92) * 2).replace(chr(34), chr(92) + chr(34))}"\n')
        command = [
            curl, "--config", config_path, "--ssl-no-revoke", "--silent", "--show-error",
            "--request", "POST", "--header", "Accept: application/json",
            "--form", "model=gpt-image-2", "--form", f"prompt={prompt}",
            "--form", f"image=@{image_path};type={mimetypes.guess_type(image_path.name)[0] or 'image/png'}",
            "--form", "size=auto", "--form", "quality=high", "--form", "output_format=png",
            "--max-time", "240", "--write-out", "\n%{http_code}", ENDPOINT,
        ]
        result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=False, timeout=250)
        if result.returncode:
            raise RuntimeError(sanitize(result.stderr.decode("utf-8", errors="replace")))
        raw, status_text = result.stdout.rsplit(b"\n", 1)
        status = int(status_text)
        if status >= 400:
            raise RuntimeError(f"Provider HTTP {status}: {sanitize(raw[:4096].decode('utf-8', errors='replace'))}")
        payload = json.loads(raw)
        items = payload.get("data") or payload.get("images") or payload.get("results")
        if isinstance(items, dict):
            items = [items]
        if not items:
            raise RuntimeError("Provider response contained no image data")
        item = items[0] if isinstance(items[0], dict) else {"value": items[0]}
        value = item.get("b64_json") or item.get("base64") or item.get("image_base64") or item.get("url") or item.get("value")
        if not value:
            raise RuntimeError("Provider response contained no supported image field")
        if isinstance(value, str) and value.startswith("data:"):
            value = value.split(",", 1)[1]
        if isinstance(value, str) and value.startswith(("http://", "https://")):
            download_request = urllib.request.Request(
                value,
                headers={
                    "Authorization": f"Bearer {key}",
                    "User-Agent": "codex-nomiss-edit-image/1.0",
                },
            )
            with urllib.request.urlopen(download_request, timeout=120) as response:
                content = response.read()
        else:
            content = base64.b64decode(value)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_bytes(content)
        print(json.dumps({"model": "gpt-image-2", "output": str(output_path)}, ensure_ascii=False))
    finally:
        if config_path:
            try:
                Path(config_path).unlink()
            except OSError:
                pass


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--image", type=Path, required=True)
    parser.add_argument("--prompt", required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    try:
        request(args.image, args.prompt, args.output)
    except Exception as exc:
        raise SystemExit(f"Error: {sanitize(str(exc))}")
