#!/usr/bin/env python3
"""Watch project files and signal when they change by writing a timestamp."""
import os
import time
import hashlib

PROJECT_DIR = "/Users/lu/Documents/Claude/lus-dev-corner"
FLAG_FILE = os.path.expanduser("~/.hermes/cache/lus-dev-corner-changed")
IGNORE = {".git", "_versions"}
POLL = 1.0  # seconds

def get_project_hash():
    total = b""
    for root, dirs, files in os.walk(PROJECT_DIR):
        # skip ignored dirs
        dirs[:] = [d for d in dirs if d not in IGNORE]
        for f in sorted(files):
            fp = os.path.join(root, f)
            if os.path.isfile(fp):
                try:
                    with open(fp, "rb") as fh:
                        total += hashlib.md5(fh.read()).digest()
                except OSError:
                    pass
    return hashlib.md5(total).hexdigest()

prev = get_project_hash()
print(f"Watching {PROJECT_DIR} (poll every {POLL}s)")
while True:
    time.sleep(POLL)
    curr = get_project_hash()
    if curr != prev:
        prev = curr
        with open(FLAG_FILE, "w") as f:
            f.write(str(time.time()))
        print(f"Change detected at {time.ctime()}")
