# 🎮 Tic Tac Toe - Tres en Raya

¡Bienvenido a **Tic Tac Toe**!  
El clásico juego de **Tres en Raya**, reinventado con un diseño moderno, animaciones suaves, estadísticas detalladas y temas personalizables.  
Juega, analiza tus movimientos, cambia el tamaño del tablero y disfruta de una experiencia fluida en cualquier dispositivo.

---

## ✨ Características principales

- 🟢 **Juego clásico mejorado** — compite entre dos jugadores locales (X y O).  
- 🎨 **Modo claro / oscuro** — cambia el tema con un solo toque.  
- 🔄 **Historial interactivo** — revisa y vuelve a jugadas anteriores.  
- 📊 **Panel de estadísticas** — victorias, empates, porcentajes y totales.  
- 🔢 **Tableros dinámicos** — juega desde 3×3 hasta 7×7.  
- 🏁 **Inicio aleatorio** — cada partida comienza con un jugador distinto.  
- ⚡ **Animaciones fluidas** — gracias a `react-native-reanimated`.  
- 📱 **Diseño responsive** — optimizado para móvil y tablet (Expo + RN).

---

## 🚀 Comenzando

<details>
<summary><strong>🧩 1. Instalar dependencias</strong></summary>

```bash
npm install
````

</details>

<details>
<summary><strong>▶️ 2. Iniciar la app</strong></summary>

```bash
npx expo start
```

Luego podrás abrirla en:

* 📱 **Expo Go**
* 🤖 **Emulador Android**
* 🍏 **Simulador iOS**

</details>

---

## 🗂 Estructura del proyecto

<details>
<summary><strong>📁 Ver estructura</strong></summary>

```
├── app/                  # Entradas principales y navegación (file-based routing)
├── components/            # Componentes visuales (Board, TopBar, Modals, etc.)
├── contexts/              # Contextos globales (ThemeContext)
├── hooks/                 # Lógica de juego y estadísticas (useTicTacToe, useGameStats)
├── lib/                   # Funciones puras (calculateWinner, gameStorage)
├── assets/                # Recursos estáticos (imágenes, íconos)
├── global.css             # Estilos globales (Tailwind + NativeWind)
└── README.md
```

</details>

---

## 🎮 Cómo jugar

1. Al iniciar una partida, un jugador aleatorio (X u O) comenzará.
2. Toca una celda vacía para colocar tu símbolo.
3. Gana alineando tres (o más) símbolos en fila, columna o diagonal.
4. Usa el **historial de movimientos** para retroceder o analizar jugadas.
5. Consulta tus **estadísticas acumuladas** al finalizar.

---

## 📊 Estadísticas

| Métrica                        | Descripción                                       |
| ------------------------------ | ------------------------------------------------- |
| 🏆 **Victorias X / O**         | Número total de partidas ganadas por cada jugador |
| ⚖️ **Empates**                 | Partidas sin ganador                              |
| 📈 **Porcentaje de victorias** | Eficiencia de cada jugador                        |
| 🎮 **Total de partidas**       | Suma total de todas las partidas jugadas          |
| 🗑 **Borrar estadísticas**     | Reinicia todas las métricas con un toque          |

---

## 💡 Consejos y trucos

* Controla el **centro del tablero** para tener ventaja.
* Cambia el tamaño del tablero para **aumentar la dificultad**.
* Revisa el historial para **mejorar tu estrategia**.
* Usa el **tema oscuro** para una experiencia más inmersiva 🌙.

---

## ⚙️ Tecnologías utilizadas

| Categoría               | Herramienta                                                                            |
| ----------------------- | -------------------------------------------------------------------------------------- |
| 🧠 Framework            | [React Native](https://reactnative.dev/) con [Expo](https://expo.dev/)                 |
| 💨 Estilos              | [Tailwind CSS](https://tailwindcss.com/) con [NativeWind](https://www.nativewind.dev/) |
| 🎞 Animaciones          | [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)         |
| ⚙️ Estado               | Context API + Custom Hooks                                                             |
| 🗃 Almacenamiento local | Async Storage (persistencia de estadísticas)                                           |

---

## 🚧 Próximas mejoras

* 🤖 **Modo 1 jugador (IA básica)**
* 🌐 **Modo multijugador local o en línea**
* 🏅 **Rachas, logros y niveles**
* 📊 **Historial detallado de partidas**

---

## 🧑‍💻 Autor

Desarrollado con ❤️ usando **Expo**, **React Native** y **TypeScript**.
Contribuciones y mejoras son siempre bienvenidas 🙌

---

> “Cada partida es una nueva oportunidad para pensar diferente.”
> — Tic Tac Toe Reloaded 🎯
