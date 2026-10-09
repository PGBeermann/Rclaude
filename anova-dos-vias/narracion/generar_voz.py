"""
Genera la narración del tutorial con la API de ElevenLabs (text-to-speech) y
actualiza src/data/voz.json con la duración de cada clip, que Remotion usa
para ajustar la duración de cada escena.

Uso (en su equipo o VPS, con acceso a api.elevenlabs.io):
    export ELEVENLABS_API_KEY="sk_..."
    python3 narracion/generar_voz.py            # genera solo los clips que faltan
    python3 narracion/generar_voz.py --forzar   # regenera todos
    python3 narracion/generar_voz.py --solo 06  # regenera una escena

Opcional: ELEVENLABS_VOICE_ID (por defecto, «David – Clear, Warm and Patient»,
español latinoamericano) y ELEVENLABS_MODEL_ID (por defecto eleven_multilingual_v2).
Solo usa la biblioteca estándar de Python; requiere ffprobe (FFmpeg) para medir la duración.
"""
import argparse
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
TEXTOS = RAIZ / "narracion"
SALIDA = RAIZ / "public" / "voz"
VOZ_JSON = RAIZ / "src" / "data" / "voz.json"

VOICE_ID = os.environ.get("ELEVENLABS_VOICE_ID", "dQ0C8BEdKF2odmELvNee")
MODEL_ID = os.environ.get("ELEVENLABS_MODEL_ID", "eleven_multilingual_v2")
URL = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}?output_format=mp3_44100_128"


def sintetizar(texto: str, previo: str, siguiente: str, destino: Path, clave: str) -> None:
    cuerpo = {
        "text": texto,
        "model_id": MODEL_ID,
        "language_code": "es",
        # el contexto vecino mantiene una entonación continua entre escenas
        "previous_text": previo,
        "next_text": siguiente,
        "voice_settings": {"stability": 0.55, "similarity_boost": 0.8, "style": 0.0,
                           "use_speaker_boost": True, "speed": 0.97},
    }
    req = urllib.request.Request(URL, data=json.dumps(cuerpo).encode("utf-8"), method="POST",
                                 headers={"xi-api-key": clave, "Content-Type": "application/json",
                                          "Accept": "audio/mpeg"})
    for intento in range(5):
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                destino.write_bytes(r.read())
            return
        except urllib.error.HTTPError as e:
            if e.code == 429 and intento < 4:  # límite de concurrencia: esperar y reintentar
                time.sleep(2 ** (intento + 1))
                continue
            sys.exit(f"Error {e.code} en {destino.name}: {e.read().decode('utf-8', 'replace')}")


def duracion(mp3: Path) -> float:
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "default=nw=1:nk=1", str(mp3)], capture_output=True, text=True, check=True)
    return round(float(out.stdout.strip()), 3)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--forzar", action="store_true", help="regenerar todos los clips")
    ap.add_argument("--solo", help="número de escena a regenerar, p. ej. 06")
    args = ap.parse_args()

    archivos = sorted(TEXTOS.glob("escena-*.txt"))
    textos = [a.read_text(encoding="utf-8").strip() for a in archivos]
    SALIDA.mkdir(parents=True, exist_ok=True)
    clave = os.environ.get("ELEVENLABS_API_KEY")

    for i, a in enumerate(archivos):
        n = a.stem.split("-")[1]
        mp3 = SALIDA / f"escena-{n}.mp3"
        pedir = args.forzar or not mp3.exists() or args.solo == n
        if args.solo and args.solo != n:
            pedir = False
        if pedir:
            if not clave:
                print(f"Escena {n}: sin audio (defina ELEVENLABS_API_KEY para generarlo).")
                continue
            print(f"Generando escena {n}…")
            sintetizar(textos[i], textos[i - 1] if i else "", textos[i + 1] if i + 1 < len(textos) else "",
                       mp3, clave)

    voz = {p.stem.split("-")[1]: duracion(p) for p in sorted(SALIDA.glob("escena-*.mp3"))}
    VOZ_JSON.write_text(json.dumps(voz, indent=2) + "\n", encoding="utf-8")
    total = sum(voz.values())
    print(f"{len(voz)} clips, {total:.1f} s de narración → {VOZ_JSON.relative_to(RAIZ)}")


if __name__ == "__main__":
    main()
