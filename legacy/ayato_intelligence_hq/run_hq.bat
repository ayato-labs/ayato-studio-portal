@echo off
setlocal
title Ayato Intelligence HQ - Control Center
cd /d "%~dp0"

echo ===================================================
echo   Ayato Intelligence HQ : システム管制塔 起動
echo ===================================================
echo.
echo [1/2] 依存関係のチェック中...
if not exist "node_modules\" (
    echo node_modules が見つかりません。セットアップを開始します...
    call npm install
)

echo [2/2] ローカルサーバーを起動しています...
echo アクセス先: http://localhost:3000
echo.
echo ※ 終了するにはこのウィンドウを閉じるか、Ctrl+C を押してください。
echo ---------------------------------------------------

call npm run dev

pause
