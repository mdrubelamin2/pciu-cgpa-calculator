# PCIU CGPA Calculator

A modern Progressive Web App (PWA) for Port City International University students to calculate their CGPA and view academic results with interactive visualizations.

**🌐 Live Demo:** [pciu-result.vercel.app](https://pciu-result.vercel.app/) | [pciu-cgpa-calculator.vercel.app](https://pciu-cgpa-calculator.vercel.app/)

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue)](https://pciu-result.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Biome](https://img.shields.io/badge/Biome-2.0.6-60a5fa)](https://biomejs.dev/)

## ✨ Features

- **🎯 Instant CGPA Calculation** - Calculate cumulative GPA with a single student ID input
- **📊 Interactive Charts** - Visualize academic progress with Chart.js line graphs
- **📱 Progressive Web App** - Installable, offline-capable mobile experience
- **🌙 Dark/Light Theme** - Seamless theme switching with system preference detection
- **📄 PDF Export** - Download academic results as formatted PDF documents
- **⚡ Performance Optimized** - Built with Next.js 15, Turbopack, and React Compiler
- **🔄 Real-time Data** - Fetches latest results from PCIU's official systems
- **💾 Smart Caching** - Redis-based caching with LRU fallback for optimal performance
- **📝 Edit Mode** - Modify and recalculate results for academic planning

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18.0.0
- **Bun** ≥ 1.0.0 (recommended) or npm/yarn/pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/mdrubelamin2/pciu-cgpa-calculator.git
cd pciu-cgpa-calculator

# Install dependencies
bun install

# Start development server
bun dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### Example Student ID Format
```
CSE 019 06859
```

## 🛠️ Development

### Available Scripts

```bash
# Development with Turbopack
bun dev

# Production build
bun build
bun start

# Code quality
bun run lint          # Check linting and formatting
bun run lint:fix      # Auto-fix issues
bun run format        # Format code only
bun run type-check    # TypeScript type checking

# PWA service worker generation
bun run generate-sw
```

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [id]/              # Dynamic student ID routes
│   ├── api/               # API endpoints
│   │   ├── student/       # Student information
│   │   ├── trimester-result/ # Semester results
│   │   ├── online-result/ # Live result fetching
│   │   └── trimesters/    # Available semesters
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── atoms/                 # Jotai state management
├── components/            # React components
│   ├── CGPABox/          # CGPA display
│   ├── CGPAChart/        # Chart visualization
│   ├── StudentIdForm/    # ID input form
│   ├── GPATable/         # Results table
│   └── ...
├── lib/                  # Utility libraries
├── utils/                # Helper functions
│   ├── cache.ts          # Caching utilities
│   ├── helpers.ts        # General helpers
│   └── urls.ts           # API endpoints
└── types/                # TypeScript definitions
```

## 🏗️ Architecture

### Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | Next.js 15 | React framework with App Router |
| **Runtime** | Bun | Fast JavaScript runtime and package manager |
| **Language** | TypeScript | Type-safe JavaScript |
| **State Management** | Jotai | Atomic state management |
| **Styling** | CSS Modules | Component-scoped styling |
| **Charts** | Chart.js + react-chartjs-2 | Interactive data visualization |
| **PWA** | Workbox | Service worker and caching |
| **Caching** | Upstash Redis + LRU Cache | Multi-tier caching strategy |
| **Parsing** | node-html-parser | HTML parsing for data extraction |
| **Code Quality** | Biome | Linting, formatting, and imports |
| **Deployment** | Vercel | Serverless hosting platform |

### Key Features Implementation

#### 🔄 Data Flow
1. **Student ID Input** → API validation → Student info retrieval
2. **Semester Data Fetching** → Parallel API calls → Result aggregation
3. **CGPA Calculation** → Real-time computation → Chart visualization
4. **Caching Strategy** → Redis (primary) → LRU Cache (fallback)

#### 📊 State Management (Jotai)
```typescript
// Global atoms
$studentId          // Current student ID
$studentInfo        // Student details
$allResults         // All semester results
$editMode           // Edit mode toggle
$modal              // Modal state
```

#### 🎨 Theme System
- CSS custom properties for theme variables
- `next-themes` for theme persistence
- System preference detection
- Smooth theme transitions

#### 📱 PWA Features
- Offline functionality with service worker
- App manifest for installation
- Background sync for data updates
- Push notification support (ready)

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/student/[id]` | GET | Fetch student information |
| `/api/trimester-result/[studentId]/[trimester]` | GET | Get semester results |
| `/api/online-result/[studentId]` | GET | Fetch live results |
| `/api/trimesters` | GET | Available semester list |

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run quality checks**
   ```bash
   bun run lint:fix
   bun run type-check
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Style

This project uses **Biome** for consistent code formatting and linting:

- **Formatting**: 2-space indentation, single quotes, trailing commas
- **Linting**: Recommended rules with TypeScript support
- **Import Organization**: Automatic import sorting
- **File Formatting**: Consistent line endings and spacing

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

### Development Guidelines

#### Component Development
- Use TypeScript for all components
- Implement proper error boundaries
- Follow React best practices
- Use CSS Modules for styling
- Ensure mobile responsiveness

#### State Management
- Use Jotai atoms for global state
- Keep components pure when possible
- Implement proper loading states
- Handle error states gracefully

#### Performance
- Implement proper caching strategies
- Use dynamic imports for code splitting
- Optimize images and assets
- Monitor Core Web Vitals

#### Testing
- Write unit tests for utilities
- Test API endpoints thoroughly
- Ensure cross-browser compatibility
- Test PWA functionality

### Areas for Contribution

#### 🐛 Bug Fixes
- Cross-browser compatibility issues
- Mobile responsiveness improvements
- Performance optimizations
- Accessibility enhancements

#### ✨ Feature Enhancements
- Additional chart types and visualizations
- Enhanced PDF export formatting
- Improved offline functionality
- Advanced filtering and search

#### 🔧 Technical Improvements
- Test coverage expansion
- Documentation improvements
- Performance monitoring
- Security enhancements

#### 🎨 UI/UX Improvements
- Design system implementation
- Animation and micro-interactions
- Accessibility improvements
- Mobile-first optimizations

## 📝 Environment Variables

Create a `.env.local` file for local development:

```bash
# Optional: Upstash Redis (for caching)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your GitHub repository to Vercel**
2. **Configure environment variables**
3. **Deploy automatically on push to main**

### Manual Deployment

```bash
# Build the application
bun run build

# Start production server
bun start
```

### Docker Deployment

```dockerfile
FROM oven/bun:1 as base
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Build application
COPY . .
RUN bun run build

# Production stage
FROM oven/bun:1-slim
WORKDIR /app
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./

EXPOSE 3000
CMD ["bun", "start"]
```

## 📊 Performance

### Core Web Vitals
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

### Optimization Features
- **Image Optimization**: Next.js automatic optimization
- **Code Splitting**: Dynamic imports and route-based splitting
- **Caching**: Multi-tier caching with Redis and LRU
- **Compression**: Gzip and Brotli compression
- **CDN**: Vercel Edge Network

## 🔒 Security

- **Input Validation**: Comprehensive validation for student IDs
- **Rate Limiting**: API endpoint protection
- **CORS Configuration**: Proper cross-origin resource sharing
- **Content Security Policy**: XSS protection
- **Secure Headers**: Security-focused HTTP headers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Port City International University** for providing the academic data
- **Next.js Team** for the amazing framework
- **Vercel** for hosting and deployment platform
- **Open Source Community** for the incredible tools and libraries

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/mdrubelamin2/pciu-cgpa-calculator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mdrubelamin2/pciu-cgpa-calculator/discussions)
- **Email**: [Contact Developer](mailto:mdrubelamin2@gmail.com)

---

**Made with ❤️ for PCIU students by the open source community**
