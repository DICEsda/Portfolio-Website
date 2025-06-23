# Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS. Features include smooth scroll navigation, dark/light mode toggle, animated sections, and a functional contact form with EmailJS integration.

## 🚀 Features

- **Responsive Design**: Optimized for all device sizes
- **Dark/Light Mode**: Toggle between themes with smooth transitions
- **Smooth Scrolling**: Navigation with scroll snapping
- **Animated Sections**: Fade-in animations for better UX
- **Project Carousel**: Interactive project showcase with navigation
- **Contact Form**: Functional contact form with EmailJS integration
- **Mobile Optimized**: Touch-friendly navigation and interactions

## 🛠️ Technologies Used

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling and responsive design
- **Vite** - Build tool and development server
- **EmailJS** - Contact form functionality
- **Font Awesome** - Icons
- **GitHub Pages** - Deployment

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/DICEsda/Portfolio-Website.git
cd Portfolio-Website/portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🚀 Deployment

### Automatic Deployment (Recommended)

This project is configured for automatic deployment to GitHub Pages using GitHub Actions. Simply push your changes to the `main` branch and the site will be automatically deployed.

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to GitHub Pages:
```bash
npm run deploy
```

## 📁 Project Structure

```
portfolio/
├── src/
│   ├── components/     # React components
│   ├── context/        # React context providers
│   ├── assets/         # Static assets
│   └── index.css       # Global styles
├── public/             # Public assets
├── dist/               # Build output
└── package.json        # Dependencies and scripts
```

## 🎨 Customization

### Colors
Update the color scheme in `src/index.css`:
```css
:root {
  --color-primary: #ffffff;
  --color-secondary: #ff9966;
  --color-tertiary: #555555;
  --color-light: #333333;
  --color-card: #f5f5f5;
}

.dark {
  --color-primary: #272727;
  --color-secondary: #FF6F61;
  --color-tertiary: #8892b0;
  --color-light: #ccd6f6;
  --color-card: #3A3A3A;
}
```

### Projects
Update the projects data in `src/components/Projects.tsx`:
```typescript
const projects: Project[] = [
  {
    title: "Your Project",
    description: "Project description",
    technologies: ["React", "TypeScript"],
    image: "project-image-url"
  }
]
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **Live Site**: [https://DICEsda.github.io/Portfolio-Website](https://DICEsda.github.io/Portfolio-Website)
- **GitHub Repository**: [https://github.com/DICEsda/Portfolio-Website](https://github.com/DICEsda/Portfolio-Website)

---

Designed & Built with ❤️ by [Your Name]
