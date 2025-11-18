@echo off
echo ================================================
echo USE NERD - Reinicializacao Completa do Frontend
echo ================================================

echo.
echo [1/4] Matando processos Node.js na porta 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo Matando PID %%a...
    taskkill /F /PID %%a 2>nul
)

echo.
echo [2/4] Removendo build cache do Next.js...
cd storefront
if exist .next (
    rd /s /q .next
    echo Cache removido!
) else (
    echo Cache ja estava limpo
)

echo.
echo [3/4] Aguardando 3 segundos...
timeout /t 3 /nobreak >nul

echo.
echo [4/4] Iniciando frontend em modo desenvolvimento...
echo.
echo ================================================
echo Frontend iniciando em http://localhost:3000
echo Pressione Ctrl+C para parar
echo ================================================
echo.

npm run dev
