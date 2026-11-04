#!/usr/bin/env python3
"""Build or check the public skill ZIP from an explicit, credential-free manifest."""

import argparse
import hashlib
import io
from pathlib import Path
import stat
import zipfile


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs/skills/magpie-bridge"
DOWNLOADS = ROOT / "site/public/downloads"
FILES = ("SKILL.md", "agents/openai.yaml", "assets/gpt-claude")
NAME = "magpie-bridge.zip"


def package():
    buffer = io.BytesIO()
    # The small bundle is stored uncompressed so bytes are stable across zlib versions.
    with zipfile.ZipFile(buffer, "w", compression=zipfile.ZIP_STORED) as archive:
        for name in FILES:
            source = SOURCE / name
            if source.is_symlink() or not source.is_file():
                raise ValueError(f"Expected a regular source file: {source}")
            entry = zipfile.ZipInfo("magpie-bridge/" + name, (2026, 11, 4, 0, 0, 0))
            entry.create_system = 3
            mode = 0o755 if name == "assets/gpt-claude" else 0o644
            entry.external_attr = (stat.S_IFREG | mode) << 16
            entry.compress_type = zipfile.ZIP_STORED
            archive.writestr(entry, source.read_bytes())
    return buffer.getvalue()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Check committed downloads without writing")
    args = parser.parse_args()
    data = package()
    checksum = f"{hashlib.sha256(data).hexdigest()}  {NAME}\n".encode()
    outputs = {DOWNLOADS / NAME: data, DOWNLOADS / (NAME + ".sha256"): checksum}
    if args.check:
        for path, expected in outputs.items():
            if not path.is_file() or path.read_bytes() != expected:
                parser.exit(1, "Skill download is missing or stale. Run npm run skill:package.\n")
        print("Skill ZIP and checksum match the reviewed source files.")
    else:
        DOWNLOADS.mkdir(parents=True, exist_ok=True)
        for path, content in outputs.items():
            path.write_bytes(content)
        print(f"Packaged {len(FILES)} files into {NAME} ({len(data)} bytes).")


if __name__ == "__main__":
    main()
