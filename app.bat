@echo off

:: Navegar al directorio del backend y ejecutar el servidor
cd gym-backend
start /B cmd /C "node index.js"

:: Esperar unos segundos para asegurarse de que el servidor backend está en ejecución
timeout /t 5 /nobreak

:: Navegar al directorio del frontend
cd ../gym-management

:: Iniciar el frontend en segundo plano
start /B cmd /C "npm start"

:: Comprobar cuándo está disponible el frontend
:CHECK_FRONTEND
curl -s http://localhost:3000 >nul
if errorlevel 1 (
    timeout /t 2 /nobreak >nul
    goto CHECK_FRONTEND
)

:: Una vez que el frontend esté disponible, abrir el navegador
start http://localhost:3000

:: Ocultar la ventana de comandos después de ejecutar todo
exit
