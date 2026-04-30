# Snake JS

Implementación clásica del juego de la serpiente usando HTML5 Canvas y JavaScript puro, sin dependencias ni frameworks.

![JavaScript](https://img.shields.io/badge/JavaScript-vanilla-yellow)
![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange)

---

## Características

- Renderizado en `<canvas>` con sprites para cabeza, cuerpo, cola y bloques de giro.
- Tablero adaptativo al tamaño del viewport (se calcula al cargar la página).
- Dos manzanas simultáneas en pantalla.
- Sistema de puntuación dinámico: a mayor velocidad, más puntos por manzana.
- Detección de colisiones con bordes y con el propio cuerpo.
- Sonidos al comer y al perder.
- Controles de teclado y soporte de gestos táctiles (swipe).
- Pausa, reinicio y selector de velocidad (1–9) en tiempo real.

## Cómo jugar

Basta con abrir `index.html` en un navegador moderno. No hay que compilar ni instalar nada.

```bash
git clone <repo>
cd snakejs
xdg-open index.html   # Linux
# o simplemente doble click sobre index.html
```

> Algunos navegadores bloquean el autoplay de audio hasta que el usuario interactúa con la página. El primer click en *Jugar* habilita el sonido.

### Controles

| Acción           | Teclado            | Móvil               |
|------------------|--------------------|---------------------|
| Mover arriba     | `↑`                | swipe arriba        |
| Mover abajo      | `↓`                | swipe abajo         |
| Mover izquierda  | `←`                | swipe izquierda     |
| Mover derecha    | `→`                | swipe derecha       |
| Pausa / reanudar | botón *Pausa*      | botón *Pausa*       |
| Iniciar / reiniciar | botón *Jugar*   | botón *Jugar*       |

### Velocidad

El campo *Velocidad* acepta valores del 1 al 9:

- `1` = más lento (1000 ms por tick → 1 punto por manzana)
- `9` = más rápido (100 ms por tick → 9 puntos por manzana)

El cambio se aplica de inmediato durante la partida.

## Estructura del proyecto

```
snakejs/
├── index.html        # Estructura del DOM y referencias a sprites
├── main.css          # Estilos del tablero, botones y popup
├── main.js           # Lógica del juego (loop, render, input)
├── package.json      # Dependencias de desarrollo (eslint)
├── .eslintrc.json    # Config de ESLint (standard)
├── assets/           # Sprites del snake, manzana, fondo
│   ├── apple.png
│   ├── grass.png
│   ├── snake-head.png
│   ├── snake-body.png
│   ├── snake-tail.png
│   └── snake-turn.png
└── sounds/           # Efectos de sonido
    ├── eat.wav
    └── end.ogg
```

## Detalles de implementación

- **Tamaño de bloque:** `40 px`. Todas las posiciones del snake y la comida se alinean a una rejilla de ese paso.
- **Dimensiones del tablero:** se calculan en `getDimensions()` a partir de `window.innerWidth` y `0.9 * window.innerHeight`, redondeadas al múltiplo de 40 más cercano.
- **Loop principal:** `setInterval` con periodo igual a `speed` ms. Cada tick comprueba comida, mueve la serpiente y verifica colisiones.
- **Render del snake:** se limpian los bloques actuales con `clearRect`, se hace `unshift` de la nueva cabeza y `pop` de la cola si no hay crecimiento. Cada bloque se dibuja con la sprite correspondiente (cabeza, cuerpo, cola o giro) y la rotación adecuada.
- **Bloqueo de input:** una bandera `move.lock` evita que el jugador cambie dos veces de dirección dentro del mismo tick (impide darse la vuelta y suicidarse en un solo frame).

## Desarrollo

El proyecto utiliza ESLint con la config `standard`.

```bash
npm install
npx eslint main.js
```

## Limitaciones conocidas

- En algunos navegadores el autoplay de audio queda silenciado hasta la primera interacción del usuario.
- El tablero no se redimensiona dinámicamente al cambiar el tamaño de la ventana; hay que recargar la página.
- En pantallas táctiles el `touchmove` puede solaparse con el scroll de la página si el gesto se inicia fuera del canvas.
