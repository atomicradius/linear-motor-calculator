@echo off
chcp 65001 >nul
echo ========================================
echo 🚀 直线电机推力计算器 - 快速部署脚本
echo ========================================
echo.

echo 📋 请按照以下步骤操作：
echo.
echo 1️⃣ 首先，请在GitHub上创建一个新仓库
echo    - 访问 https://github.com
echo    - 点击右上角 "+" 号，选择 "New repository"
echo    - 仓库名称：linear-motor-calculator
echo    - 选择 "Public"
echo    - 不要勾选 "Add a README file"
echo    - 点击 "Create repository"
echo.

echo 2️⃣ 复制您的GitHub用户名和仓库地址
echo    例如：https://github.com/YOUR_USERNAME/linear-motor-calculator.git
echo.

set /p github_url="请输入您的GitHub仓库地址: "

echo.
echo 3️⃣ 正在配置Git并上传代码...
echo.

git remote add origin %github_url%
if %errorlevel% neq 0 (
    echo ❌ 添加远程仓库失败，可能已经添加过了
    echo 正在尝试更新远程仓库地址...
    git remote set-url origin %github_url%
)

git branch -M main
git add .
git commit -m "更新：直线电机推力计算器" 2>nul
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ 代码上传成功！
    echo.
    echo 4️⃣ 现在请启用GitHub Pages：
    echo    - 在GitHub仓库页面，点击 "Settings" 标签
    echo    - 左侧菜单找到 "Pages"
    echo    - 在 "Source" 部分，选择 "Deploy from a branch"
    echo    - 选择 "main" 分支和 "/ (root)" 文件夹
    echo    - 点击 "Save"
    echo.
    echo 5️⃣ 几分钟后，您的网站将在以下地址可用：
    echo    %github_url:~0,-4%.github.io/linear-motor-calculator
    echo.
    echo 🎉 部署完成！您的网页现在可以通过外网访问了。
) else (
    echo.
    echo ❌ 代码上传失败，请检查：
    echo    - GitHub仓库地址是否正确
    echo    - 是否已正确创建GitHub仓库
    echo    - 网络连接是否正常
)

echo.
echo 📖 更多部署选项请查看 "部署指南.md" 文件
echo.
pause 