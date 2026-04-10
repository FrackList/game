#!/usr/bin/env python3
"""
Простой HTTP сервер для запуска браузерной MMORPG игры.
Обходит CORS ограничения при открытии файлов локально.
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from urllib.parse import urlparse

# Порт по умолчанию
DEFAULT_PORT = 8000

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Обработчик запросов с поддержкой CORS заголовков."""
    
    def end_headers(self):
        # Добавляем CORS заголовки для разрешения загрузки модулей
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()
    
    def log_message(self, format, *args):
        """Красивое логирование запросов."""
        method = self.command
        path = self.path
        status = self._status_code if hasattr(self, '_status_code') else 200
        
        # Цвета для разных типов запросов
        colors = {
            'GET': '\033[92m',      # Зеленый
            'POST': '\033[94m',     # Синий
            'OPTIONS': '\033[90m',  # Серый
            '404': '\033[91m',      # Красный
        }
        
        color = colors.get(method, '\033[0m')
        if status == 404:
            color = colors['404']
        
        reset = '\033[0m'
        print(f"{color}[{self.log_date_time_string()}] {method} {path} - {status}{reset}")
    
    def do_OPTIONS(self):
        """Обработка preflight запросов для CORS."""
        self.send_response(200)
        self.end_headers()
    
    def do_GET(self):
        """Обработка GET запросов."""
        parsed_path = urlparse(self.path)
        
        # Перенаправление корневого пути на index.html
        if parsed_path.path == '/':
            self.path = '/index.html'
        
        try:
            super().do_GET()
        except Exception as e:
            print(f"\033[91mОшибка: {e}\033[0m")


def start_server(port=DEFAULT_PORT):
    """Запуск HTTP сервера."""
    
    # Получаем директорию со скриптом
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    # Создаем сервер
    with socketserver.TCPServer(("", port), CORSRequestHandler) as httpd:
        url = f"http://localhost:{port}"
        
        print("\n" + "="*60)
        print("🎮 MMORPG Browser Game Server")
        print("="*60)
        print(f"📁 Директория: {script_dir}")
        print(f"🌐 URL: {url}")
        print(f"🚀 Сервер запущен! Нажмите Ctrl+C для остановки")
        print("="*60 + "\n")
        
        # Открываем браузер автоматически
        try:
            webbrowser.open(url)
            print("✅ Браузер открыт автоматически")
        except Exception as e:
            print(f"⚠️  Не удалось открыть браузер автоматически: {e}")
            print(f"   Откройте {url} вручную")
        
        print("\n📋 Логи запросов:\n")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 Сервер остановлен пользователем")
            sys.exit(0)


if __name__ == "__main__":
    # Парсим аргументы командной строки
    port = DEFAULT_PORT
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f"⚠️  Неверный номер порта: {sys.argv[1]}")
            print(f"   Будет использован порт по умолчанию: {DEFAULT_PORT}")
    
    start_server(port)
