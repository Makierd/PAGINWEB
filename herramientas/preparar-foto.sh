#!/bin/bash
# Prepara la foto de un conferencista para la web.
# Recorta a cuadrado, ajusta a 400x400 y la guarda como JPG optimizado.
#
#   ./herramientas/preparar-foto.sh <foto-original> <nombre-archivo> [zona]
#
#   zona (opcional): donde recortar si la persona no esta centrada.
#                    center (por defecto), north, south, east, west,
#                    northeast, northwest, southeast, southwest
#
# Ejemplo:
#   ./herramientas/preparar-foto.sh ~/Downloads/kenia.jpg kenia-rodriguez north

set -e
ORIGEN="$1"
NOMBRE="$2"
ZONA="${3:-center}"
DESTINO="$(dirname "$0")/../assets/img/personas/$NOMBRE.jpg"

if [ -z "$ORIGEN" ] || [ -z "$NOMBRE" ]; then
  echo "Uso: $0 <foto-original> <nombre-archivo> [zona]"
  exit 1
fi
if [ ! -f "$ORIGEN" ]; then
  echo "No existe el archivo: $ORIGEN"
  exit 1
fi

magick "$ORIGEN" \
  -auto-orient \
  -gravity "$ZONA" \
  -resize "400x400^" \
  -extent 400x400 \
  -strip -quality 85 \
  "$DESTINO"

echo "Guardada: assets/img/personas/$NOMBRE.jpg  ($(magick identify -format '%wx%h' "$DESTINO"))"
echo "Recarga la pagina: la foto aparece sola en la tarjeta."
