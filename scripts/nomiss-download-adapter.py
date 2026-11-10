"""Use the installed image skill with Windows curl for generated-asset downloads."""
import importlib.util
from pathlib import Path
import subprocess
import sys

skill = Path("D:/CodexHome/skills/nomiss-generate-images/scripts/generate_image.py")
spec = importlib.util.spec_from_file_location("nomiss_skill", skill)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

def download_with_curl(url, timeout):
    if url.startswith("data:"):
        return module.decode_data_uri(url)
    if not url.startswith("https://"):
        raise RuntimeError("Generated asset URL must use HTTPS.")
    # URL comes only from the image provider response. Never send API credentials.
    result = subprocess.run(
        ["curl.exe", "--fail", "--location", "--silent", "--show-error",
         "--ssl-no-revoke", "--max-time", str(timeout), url],
        capture_output=True, check=False,
    )
    if result.returncode:
        raise RuntimeError("Generated asset download failed (curl status %s)." % result.returncode)
    return result.stdout, None

module.download_image = download_with_curl
try:
    sys.exit(module.main())
except (OSError, ValueError, RuntimeError) as exc:
    print(module.sanitize_provider_detail(str(exc)), file=sys.stderr)
    sys.exit(1)
