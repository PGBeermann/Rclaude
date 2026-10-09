#!/usr/bin/env python3
"""
Renderizado por lotes desde Python, invocando la CLI de Remotion con subprocess.

Útil para integrarlo en flujos existentes (Flask/Django, cron en el VPS, etc.).
Requiere Node.js >= 18 y haber ejecutado `npm install` en la carpeta del proyecto.

    python3 scripts/render_lote.py                      # todos los experimentos
    python3 scripts/render_lote.py acido-acetico        # filtra por id

Docs de la CLI: https://www.remotion.dev/docs/cli/render
"""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent


def renderizar(id_: str, props: dict) -> Path:
    salida = RAIZ / "out" / f"{id_}.mp4"
    salida.parent.mkdir(exist_ok=True)
    # --props acepta una ruta a un archivo JSON: evita problemas de escape en la shell.
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8") as f:
        json.dump(props, f, ensure_ascii=False)
        ruta_props = f.name
    try:
        subprocess.run(
            ["npx", "remotion", "render", "src/index.ts", "Titulacion", str(salida), f"--props={ruta_props}"],
            cwd=RAIZ,
            check=True,
        )
    finally:
        Path(ruta_props).unlink(missing_ok=True)
    return salida


def main() -> None:
    filtro = sys.argv[1] if len(sys.argv) > 1 else ""
    experimentos = json.loads((RAIZ / "data" / "experimentos.json").read_text(encoding="utf-8"))
    for exp in (e for e in experimentos if filtro in e["id"]):
        print(f"▶ {exp['id']}")
        print(f"  ✔ {renderizar(exp['id'], exp['props']).relative_to(RAIZ)}")


if __name__ == "__main__":
    main()
