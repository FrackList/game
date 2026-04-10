#!/usr/bin/env python3
"""
Простой HTTP сервер для запуска браузерной MMORPG игры.
Запускает локальный сервер для корректной работы CORS и загрузки модулей.

Использование:
    python server.py [порт]
    
По умолчанию порт 8000.
Откройте в браузере: http://localhost:8000
"""

import http.server
import socketserver
import os
import sys
import webbrowser
from functools import partial

# Конфигурация
DEFAULT_PORT = 8000
GAME_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'game')

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    """Кастомный обработчик с улучшенными заголовками для игр."""
    
    def __init__(self, *args, directory=None, **kwargs):
        super().__init__(*args, directory=directory, **kwargs)
    
    def end_headers(self):
        # Добавляем заголовки для корректной работы игр
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        super().end_headers()
    
    def log_message(self, format, *args):
        """Красивое логирование запросов."""
        print(f"\033[92m[SERVER]\033[0m {args[0]}")

def start_server(port=DEFAULT_PORT):
    """Запускает HTTP сервер."""
    
    # Проверяем существование директории с игрой
    if not os.path.exists(GAME_DIR):
        print(f"\033[91m[ERROR]\033[0m Директория с игрой не найдена: {GAME_DIR}")
        sys.exit(1)
    
    # Создаём сервер
    handler = partial(CustomHandler, directory=GAME_DIR)
    
    with socketserver.TCPServer(("", port), handler) as httpd:
        url = f"http://localhost:{port}"
        
        print("\n" + "="*60)
        print("\033[96m🎮 MMORPG Server запущен!\033[0m")
        print("="*60)
        print(f"\n📂 Директория игры: {GAME_DIR}")
        print(f"🌐 Адрес сервера: \033[94m{url}\033[0m")
        print(f"📦 Порт: {port}")
        print("\n💡 Откройте адрес в браузере или нажмите Ctrl+C для остановки")
        print("="*60 + "\n")
        
        # Автоматически открываем браузер (опционально)
        try:
            webbrowser.open(url)
            print("🌍 Браузер открыт автоматически")
        except Exception:
            pass
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n\033[93m[INFO]\033[0m Сервер остановлен пользователем")
            sys.exit(0)

if __name__ == "__main__":
    # Получаем порт из аргументов командной строки
    port = DEFAULT_PORT
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f"\033[91m[ERROR]\033[0m Неверный номер порта: {sys.argv[1]}")
            sys.exit(1)
    
    start_server(port)
