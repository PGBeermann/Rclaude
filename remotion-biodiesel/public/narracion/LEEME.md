# Pistas de narración

Coloque aquí las 12 pistas MP3 generadas en ElevenLabs, con estos nombres exactos:

```
01-portada.mp3      05-calculos.mp3     09-separacion.mp3
02-fundamento.mp3   06-metoxido.mp3     10-lavado.mp3
03-materiales.mp3   07-montaje.mp3      11-resultados.mp3
04-seguridad.mp3    08-reflujo.mp3      12-referencias.mp3
```

El texto de cada pista está en `src/narracion.ts`.
Al renderizar, cada escena se alarga automáticamente hasta que termine su voz.
Si falta una pista, esa escena se renderiza sin voz y la CLI muestra un aviso.
