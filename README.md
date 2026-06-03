# Concurso de Puentes - UNIPAZ 2026

Sistema de Votacion Electronica para la evaluacion de prototipos de puentes construidos por estudiantes del programa de Ingenieria Civil del Instituto Universitario de la Paz (UNIPAZ).

## Descripcion

Plataforma web moderna y responsive que permite a jurados externos (sector empresarial, academico e institucional) evaluar los proyectos mediante una rubrica digital accesible desde dispositivos moviles utilizando codigos QR.

## Caracteristicas Principales

- **Portal de Votacion**: Acceso via codigo QR, interfaz responsive para moviles/tablets/PC
- **Sistema de Evaluacion**: Sliders interactivos con emojis para calificacion de Estetica y Ficha Tecnica
- **Dashboard en Tiempo Real**: Graficos interactivos, KPIs y ranking automatico
- **Panel Administrativo**: Gestion de proyectos, datos tecnicos y configuracion
- **Generacion de QR**: Codigos QR descargables en PNG y SVG por proyecto
- **Calculo Automatico**: Ponderacion configurable (Carga/Peso 70%, Estetica 10%, Video 10%, Ficha 10%)

## Tecnologias

| Categoria | Tecnologia |
|-----------|-----------|
| Frontend | React 18 + TypeScript |
| Build | Vite 6 |
| Estilos | Tailwind CSS 4 |
| Estado | Zustand (persistido en localStorage) |
| Graficos | Recharts |
| QR | qrcode.react |
| Iconos | Lucide React |
| Persistencia | Firebase Firestore (opcional) / localStorage |

## Instalacion

### Prerequisitos

- Node.js >= 18
- npm >= 9

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/bridge-contest.git
cd bridge-contest

# 2. Instalar dependencias
npm install

# 3. (Opcional) Configurar Firebase
cp .env.example .env
# Editar .env con tus credenciales de Firebase

# 4. Iniciar servidor de desarrollo
npm run dev
```

## Despliegue en GitHub Pages

```bash
# Construir para produccion
npm run build

# Desplegar (requiere gh-pages)
npm run deploy
```

### Configuracion automatica con GitHub Actions

El proyecto incluye un workflow de GitHub Actions que despliega automaticamente al hacer push a la rama `main`.

## Uso

### Para Jurados/Evaluadores

1. Escanear el codigo QR proporcionado
2. Registrarse con nombre, organizacion y tipo de evaluador
3. Calificar cada puente usando los sliders (1-10)
4. Confirmar el voto

### Para Administradores

1. Acceder a `/#/admin`
2. Ingresar con la contrasena (por defecto: `unipaz2026`)
3. Gestionar proyectos, datos tecnicos y configuracion
4. Visualizar resultados en tiempo real

## Formula de Calificacion

| Criterio | Peso |
|----------|------|
| Relacion carga/peso | 70% |
| Estetica | 10% |
| Video | 10% |
| Ficha tecnica | 10% |
| **Total** | **100%** |

Los porcentajes son configurables desde el panel administrativo.

## Estructura del Proyecto

```
bridge-contest/
├── public/
│   └── images/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   ├── dashboard/
│   │   ├── ui/
│   │   └── voting/
│   ├── data/
│   ├── lib/
│   ├── pages/
│   ├── store/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

## Licencia

Este proyecto fue desarrollado para el Instituto Universitario de la Paz - UNIPAZ, Barrancabermeja, Colombia.

---

Desarrollado con React + TypeScript + Vite + Tailwind CSS
