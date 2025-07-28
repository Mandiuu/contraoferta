# 🚀 Contraoferta

**Tu consejera personal de negociación** - Una aplicación web inteligente que ayuda a desarrollar confianza y habilidades sólidas de negociación, especialmente diseñada para mujeres profesionales.

## 🌟 Características

- **💬 Chat Interactivo**: Conversación natural con tu consejera de negociación
- **🤖 IA Integrada**: Respuestas personalizadas usando Google Gemini
- **🎯 Temas Especializados**: 
  - Negociación salarial
  - Ambiente laboral
  - Negocios y contratos
  - Relaciones personales
  - Confianza y presencia
- **📱 Responsive**: Funciona perfectamente en móviles y desktop
- **⚡ Respuestas Rápidas**: Preguntas frecuentes pre-configuradas
- **🎨 Interfaz Moderna**: Diseño atractivo con Tailwind CSS

## 🛠️ Tecnologías

- **React 18** - Biblioteca de JavaScript para la UI
- **Tailwind CSS** - Framework de CSS utilitario
- **Lucide React** - Iconos modernos
- **Google Gemini API** - Inteligencia artificial conversacional
- **GitHub Pages** - Hosting gratuito

## 🚀 Instalación Local

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn
- Git

### Pasos

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/contraoferta.git
   cd contraoferta
   ```

2. **Instala dependencias**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo**
   ```bash
   npm start
   ```

4. **Abre en tu navegador**
   ```
   http://localhost:3000
   ```

## 🌐 Despliegue en GitHub Pages

### Configuración Automática

Este proyecto incluye un workflow de GitHub Actions que despliega automáticamente a GitHub Pages:

1. **Sube tu código a GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Activa GitHub Pages**
   - Ve a Settings > Pages en tu repositorio
   - Selecciona "GitHub Actions" como source
   - El deployment se ejecutará automáticamente

3. **Accede a tu app**
   ```
   https://tu-usuario.github.io/contraoferta
   ```

### Despliegue Manual

Si prefieres desplegar manualmente:

```bash
npm run build
npm run deploy
```

## ⚙️ Configuración

### API Key de Gemini

Para habilitar las respuestas de IA:

1. Obtén una API key gratuita en [Google AI Studio](https://makersuite.google.com/app/apikey)
2. En la aplicación, haz clic en "Configurar IA"
3. Pega tu API key y guarda

### Personalización

Puedes personalizar fácilmente:

- **Colores**: Modifica las clases de Tailwind en los componentes
- **Respuestas**: Edita el array `quickResponses` en `Contraoferta.jsx`
- **Temas**: Modifica el objeto `negotiationTopics`
- **Consejos**: Actualiza el objeto `negotiationAdvice`

## 📁 Estructura del Proyecto

```
contraoferta/
├── public/
│   ├── index.html          # Archivo HTML principal
│   ├── manifest.json       # Configuración PWA
│   └── favicon.ico         # Icono de la app
├── src/
│   ├── components/
│   │   └── Contraoferta.jsx # Componente principal
│   ├── App.js              # Componente raíz
│   ├── index.js            # Punto de entrada
│   └── index.css           # Estilos globales
├── .github/
│   └── workflows/
│       └── deploy.yml      # Deployment automático
├── package.json            # Dependencias y scripts
└── README.md              # Documentación
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📱 Capturas de Pantalla

### Pantalla de Bienvenida
- Formulario de nombre personalizado
- Diseño moderno con gradientes

### Chat Principal
- Interfaz conversacional intuitiva
- Temas especializados
- Respuestas rápidas desplegables

### Configuración de IA
- Panel de configuración simple
- Estado visual de la conexión
- Instrucciones claras

## 🔧 Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm test` - Ejecuta las pruebas
- `npm run deploy` - Despliega a GitHub Pages

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la sección de Issues en GitHub
2. Crea un nuevo Issue con detalles del problema
3. Incluye capturas de pantalla si es necesario

## 🌟 Características Futuras

- [ ] Autenticación de usuarios
- [ ] Historial de conversaciones
- [ ] Más idiomas
- [ ] Análisis de progreso
- [ ] Integración con calendario
- [ ] Modo oscuro

---

**Desarrollado con ❤️ para empoderar a mujeres en sus negociaciones profesionales**