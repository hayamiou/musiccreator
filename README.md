# VirtualMusicaLau (mini)

Générateur/joueur de séquences musicales dans le navigateur (Tone.js).  
Joue des notes, importe un petit fichier texte et lit la séquence.

## How to run in 1 minute

### Option A (Node)
npx http-server . -p 8080
# puis ouvre http://localhost:8080

### Option B (Python 3)
python3 -m http.server 8080
# puis ouvre http://localhost:8080

> Ne pas double-cliquer `index.html` (CORS).  
> Au premier son, le navigateur peut demander un clic pour **autoriser l’audio**.

## Fichiers utiles
- `index.html`, `script.js`, `styles.css`
- (option) `assets/notes/` si vous utilisez des samples MP3

## Import (format simple)