@echo off
chcp 65001 >nul
echo ========================================
echo 🌐 直线电机推力计算器 - 本地测试服务器
echo ========================================
echo.

echo 🔍 检测Python环境...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 找到Python，启动本地服务器...
    echo.
    echo 📱 服务器地址：http://localhost:8000
    echo 📱 局域网地址：http://%COMPUTERNAME%:8000
    echo.
    echo 💡 提示：
    echo    - 按 Ctrl+C 停止服务器
    echo    - 其他设备可以通过局域网地址访问
    echo    - 确保防火墙允许8000端口
    echo.
    echo 🚀 正在启动服务器...
    python -m http.server 8000
) else (
    echo ❌ 未找到Python，尝试使用Node.js...
    node --version >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ 找到Node.js，启动本地服务器...
        echo.
        echo 📱 服务器地址：http://localhost:8080
        echo 📱 局域网地址：http://%COMPUTERNAME%:8080
        echo.
        echo 💡 提示：
        echo    - 按 Ctrl+C 停止服务器
        echo    - 其他设备可以通过局域网地址访问
        echo    - 确保防火墙允许8080端口
        echo.
        echo 🚀 正在启动服务器...
        npx http-server -p 8080 -o
    ) else (
        echo ❌ 未找到Python或Node.js
        echo.
        echo 📋 请安装以下任一环境：
        echo    1. Python 3.x: https://www.python.org/downloads/
        echo    2. Node.js: https://nodejs.org/
        echo.
        echo 💡 或者直接双击 index.html 文件在浏览器中打开
        pause
    )
) 