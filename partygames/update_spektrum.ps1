# Dieses Skript aktualisiert das Spektrum-Spiel im Hauptprojekt.
# 1. Es liest die bearbeitbare Datei 'scratch/spektrum_decoded.html'
# 2. Es kodiert sie neu als Base64
# 3. Es schreibt die neue Daten-URL in 'src/games/spektrum-data.js'
# 4. Es startet den Haupt-Build-Prozess neu

$source = "scratch/spektrum_decoded.html"
$target = "src/games/spektrum-data.js"

if (!(Test-Path $source)) {
    Write-Host "Fehler: $source wurde nicht gefunden!" -ForegroundColor Red
    pause
    exit
}

Write-Host "🔄 Kodierung von Spektrum läuft..." -ForegroundColor Cyan
$html = Get-Content $source -Raw -Encoding utf8
$bytes = [System.Text.Encoding]::UTF8.GetBytes($html)
$base64 = [System.Convert]::ToBase64String($bytes)
"const SPEKTRUM_DATA_URL = 'data:text/html;base64,$base64';" | Out-File -FilePath $target -Encoding utf8

Write-Host "🚀 Starte Haupt-Build..." -ForegroundColor Cyan
node build.js

Write-Host "`n✅ Fertig! Spektrum wurde aktualisiert." -ForegroundColor Green
pause
