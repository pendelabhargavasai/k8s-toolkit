# K8s Tool Management

> A comprehensive web-based dashboard for discovering, managing, and understanding Kubernetes tools and plugins.

## Features

- **Tools Directory**: Browse 100+ Kubernetes tools categorized by function.
- **Plugin Catalog**: Explore `kubectl` plugins for extended cluster management.
- **Version Tracker**: Detailed feature changelog for Kubernetes releases (1.27-1.36).
- **Architecture Explorer**: Visual map of control plane components.
- **Responsive Design**: Modern, dark-themed UI built with React and TypeScript.
- **End to End Type-Safe Dashboard**: All components and pages are type-safe.
- **Project Structure**: Clean and organized project structure.
- **E2E Testing**: All pages are tested and verified.
- **Components & Hooks**: Reusable components and hooks for easy customization.
- **Performance**: Optimized for performance and user experience.
- **Accessibility**:  for all users.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Docker-ready with Nginx

## Getting Started

### Prerequisites
- Node.js >= 18
- npm

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Run in Docker
```bash
docker build -t k8s-toolkit .
docker run -p 8080:80 k8s-toolkit
```