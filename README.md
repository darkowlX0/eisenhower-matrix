# Matriz de Eisenhower con Temporizador Pomodoro

Una aplicación web intuitiva, minimalista y de alto rendimiento para la gestión del tiempo y la priorización de tareas basada en la **Matriz de Eisenhower** combinada con un temporizador **Pomodoro** de enfoque y descanso.

---

## 🚀 Características principales

### 1. Cuadrantes de Eisenhower
Organiza tus tareas en cuatro cuadrantes según su urgencia e importancia:
* **Hacer primero (Urgente e Importante - Q1):** Tareas críticas y fechas límite inminentes.
* **Programar (No Urgente pero Importante - Q2):** Planificación a largo plazo, desarrollo y proyectos estratégicos.
* **Delegar (Urgente pero No Importante - Q3):** Solicitudes imprevistas e interrupciones.
* **Eliminar (Ni Urgente ni Importante - Q4):** Tareas prescindibles que no aportan valor.

### 2. Temporizador Pomodoro Integrado
* Modos de **Enfoque** y **Descanso** con alternancia rápida.
* Tiempos personalizables en minutos para adaptarse a tus bloques de trabajo.
* Controles intuitivos: iniciar, pausar y reiniciar.

### 3. Gestión y Organización de Tareas
* Creación y edición rápida con título, cuadrante y fecha/hora límite con preservación exacta de la hora local.
* Soporte para tareas con repetición diaria y reinicio automático de estado en cada nuevo día.
* Visualización flexible: opción para mostrar u ocultar tareas completadas.
* Arrastrar y soltar (*drag & drop*) fluido para mover tareas directamente entre cuadrantes.

### 4. 100% Privado, Seguro y Autónomo (Local-First)
* No requiere registro de cuentas ni conexión a servidores externos.
* Almacenamiento persistente en el navegador (`localStorage`) con validación estricta de tipos y sanitización de datos.
* Protección mediante *Error Boundary* para evitar bloqueos de la interfaz y prevenir pérdidas silenciosas de datos.

### 5. Interfaz Moderna y Adaptable
* Soporte para modo claro y modo oscuro.
* Diseño responsivo para pantallas de escritorio, tabletas y dispositivos móviles.

---

## 🛠️ Tecnologías utilizadas

* **[React 19](https://react.dev/):** Biblioteca principal de interfaz de usuario.
* **[TypeScript](https://www.typescriptlang.org/):** Tipado estático y seguridad de código.
* **[Vite](https://vitejs.dev/):** Entorno de desarrollo y empaquetado optimizado.
* **[Tailwind CSS v4](https://tailwindcss.com/):** Estilos modernos mediante utilidades.
* **[Lucide React](https://lucide.dev/):** Iconografía accesible y coherente.
* **[date-fns](https://date-fns.org/):** Manejo y formateo localizado de fechas.

---

## 💻 Instalación y ejecución local

El proyecto utiliza **npm** como gestor de paquetes estándar:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/tu-repositorio.git
   cd tu-repositorio
   ```

2. **Instalar dependencias con npm:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

4. **Compilar para producción:**
   ```bash
   npm run build
   ```
   Genera los archivos estáticos listos para producción en la carpeta `dist/`.

---

## 🌐 Despliegue

La aplicación es una SPA (Single Page Application) estática pura, compatible con cualquier proveedor:
* **Vercel**: Detecta automáticamente el comando `npm run build` y el directorio `dist`.
* **Netlify**, **GitHub Pages** o **Cloudflare Pages**.

---

## 📄 Licencia

Este proyecto está bajo la [Licencia MIT](LICENSE).
