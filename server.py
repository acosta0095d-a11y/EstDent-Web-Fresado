#!/usr/bin/env python3
import http.server
import socketserver
import os

PORT = 8000
os.chdir(os.path.dirname(os.path.abspath(__file__)))

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"✅ Servidor activo en http://localhost:{PORT}")
    print(f"📂 Sirviendo desde: {os.getcwd()}")
    print(f"🌐 Abre en el navegador: http://localhost:{PORT}")
    print(f"⛔ Para detener: Ctrl+C")
    httpd.serve_forever()
