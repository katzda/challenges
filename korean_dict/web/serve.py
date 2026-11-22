#!/usr/bin/env python3
"""
Local static server for the korean_dict web UI.
Serves the web/ directory over HTTP.
"""

import http.server
import socketserver
import argparse
import os
from pathlib import Path

parser = argparse.ArgumentParser(description="Serve korean_dict/web locally")
parser.add_argument(
    "--host",
    default="0.0.0.0",
    help="Host interface to bind (default: 0.0.0.0)"
)
parser.add_argument(
    "--port",
    type=int,
    default=8000,
    help="Port to serve on (default: 8000)"
)

args = parser.parse_args()

# Serve the directory this file lives in
BASE_DIR = Path(__file__).resolve().parent
os.chdir(BASE_DIR)

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer((args.host, args.port), Handler) as httpd:
    print(f"Serving {BASE_DIR}")
    print(f"Open http://localhost:{args.port}/index.html")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped")
