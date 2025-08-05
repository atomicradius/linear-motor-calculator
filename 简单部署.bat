@echo off
chcp 65001 >nul
echo ========================================
echo 🌐 直线电机推力计算器 - 简单部署方案
echo ========================================
echo.

echo 📋 由于您的系统没有安装Python或Node.js，我们使用以下方案：
echo.

echo 🎯 方案一：直接分享文件（推荐）
echo    1. 将整个"推力计算网页"文件夹复制到U盘或网盘
echo    2. 分享给其他人，他们双击index.html即可使用
echo    3. 优点：简单快速，无需网络
echo    4. 缺点：无法通过外网访问
echo.

echo 🌐 方案二：使用免费托管服务
echo    1. 注册GitHub账号：https://github.com
echo    2. 创建新仓库，上传所有文件
echo    3. 启用GitHub Pages功能
echo    4. 获得外网访问地址
echo.

echo 📱 方案三：局域网分享
echo    1. 在Windows中启用文件共享
echo    2. 将文件夹设为共享
echo    3. 局域网内其他设备可通过网络路径访问
echo.

echo 💡 推荐操作步骤：
echo    1. 先尝试方案一，确保功能正常
echo    2. 如需外网访问，使用方案二
echo    3. 如需团队内使用，使用方案三
echo.

echo 📖 详细部署指南请查看 "部署指南.md" 文件
echo.

pause 