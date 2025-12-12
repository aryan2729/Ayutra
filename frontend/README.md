# Ayutra - Frontend Application

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.6-38B2AC?logo=tailwind-css)

**Modern React frontend for Ayutra - AI-Powered Ayurvedic Diet Management System**

🌐 **Live Website**: [https://ayutra.vercel.app](https://ayutra.vercel.app)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Development](#-development)
- [Project Structure](#-project-structure)
- [Pages & Routes](#-pages--routes)
- [Components](#-components)
- [State Management](#-state-management)
- [Styling](#-styling)
- [API Integration](#-api-integration)
- [Authentication](#-authentication)
- [Building for Production](#-building-for-production)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Overview

The Ayutra frontend is a modern, responsive React application built with Vite, providing an intuitive interface for healthcare practitioners and patients to manage Ayurvedic diet plans, track compliance, and analyze progress.

### Key Capabilities

- **Role-Based Access Control**: Different interfaces for Admin, Practitioner, and Patient roles
- **Real-Time Data**: Live updates and synchronization with backend API
- **Responsive Design**: Mobile-first approach with full desktop support
- **Dark Mode**: Complete theme switching capability
- **Data Visualization**: Advanced charts and graphs using Recharts and D3.js
- **PDF Export**: Generate and download reports
- **Form Management**: Efficient form handling with React Hook Form
- **Smooth Animations**: Enhanced UX with Framer Motion

---

## ✨ Features

### Core Pages

#### 🏠 Intelligent Dashboard
- Real-time patient overview
- Quick access to key metrics
- Recent activity tracking
- Health insights and notifications
- Role-specific views

#### 🤖 AI Diet Generator
- Intelligent diet plan generation
- Patient selection interface
- Diet preferences configuration
- Real-time plan preview
- Step-by-step generation process
- **Access**: Admin and Practitioner only

#### 👤 Patient Profile Builder
- Comprehensive patient information collection
- Prakriti (constitution) assessment questionnaire
- Medical history tracking
- Body measurements and vitals
- Constitution result visualization

#### 🍽️ Diet Plan Viewer
- Weekly meal planning interface
- Detailed meal cards with Ayurvedic properties
- Preparation guides and cooking instructions
- Shopping list generation
- Nutritional information display
- Weekly overview calendar

#### 🔍 Food Explorer
- Searchable Ayurvedic food database
- Advanced filtering (dosha, taste, category)
- Detailed food properties (Rasa, Guna, Virya, Vipaka)
- Dosha compatibility indicators
- Recently viewed foods
- Quick filters for common searches

#### 📈 Progress Analytics
- Compliance tracking (daily, weekly, monthly)
- Visual charts and graphs
- Health trend analysis
- Goal tracking and milestones
- Constitution comparison
- Export reports (PDF)
- Diet reports generation

#### 📋 Patient Records
- Patient list management
- Search and filter functionality
- Patient detail views
- **Access**: Admin and Practitioner only

#### 📚 Past Diets
- Historical diet plan viewing
- Diet plan comparison
- **Access**: Admin and Practitioner only

#### 💊 Remedies
- Patient-specific remedies
- Ayurvedic treatment recommendations
- **Access**: Patients only

#### 📊 Reports
- Comprehensive reporting system
- Patient progress reports
- Compliance analytics
- **Access**: Admin and Practitioner only

#### ❓ Help
- User documentation
- FAQ section
- Support information

---

## 🛠️ Tech Stack

### Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI framework |
| **Vite** | 5.0.0 | Build tool and dev server |
| **React Router** | 6.0.2 | Client-side routing |

### State Management

| Technology | Version | Purpose |
|------------|---------|---------|
| **Redux Toolkit** | 2.6.1 | Global state management |
| **React Context** | Built-in | Auth and theme context |

### UI & Styling

| Technology | Version | Purpose |
|------------|---------|---------|
| **Tailwind CSS** | 3.4.6 | Utility-first CSS framework |
| **Framer Motion** | 10.16.4 | Animation library |
| **Lucide React** | 0.484.0 | Icon library |
| **Radix UI** | Various | Accessible UI primitives |

### Forms & Validation

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Hook Form** | 7.55.0 | Form state management |
| **Pydantic** (via API) | - | Backend validation |

### Data Visualization

| Technology | Version | Purpose |
|------------|---------|---------|
| **Recharts** | 2.15.2 | Chart library |
| **D3.js** | 7.9.0 | Advanced data visualization |

### Utilities

| Technology | Version | Purpose |
|------------|---------|---------|
| **Axios** | 1.8.4 | HTTP client |
| **date-fns** | 4.1.0 | Date manipulation |
| **jsPDF** | 3.0.4 | PDF generation |
| **jspdf-autotable** | 5.0.2 | PDF table generation |
| **html2canvas** | - | Screenshot generation |

### Development Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| **ESLint** | - | Code linting |
| **PostCSS** | 8.4.8 | CSS processing |
| **Autoprefixer** | 10.4.2 | CSS vendor prefixes |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.x or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

### Recommended Tools

- **VS Code** with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - React snippets
- **Browser DevTools** for debugging

---

## 🚀 Installation

### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# API Base URL
VITE_API_BASE_URL=http://localhost:3000/api

# Environment
VITE_ENV=development
```

### Step 4: Start Development Server

```bash
npm start
# or
npm run dev
```

The application will be available at `http://localhost:4028` (or the port shown in terminal).

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# Backend API Base URL
VITE_API_BASE_URL=http://localhost:3000/api

# Environment (development/production)
VITE_ENV=development
```

### Vite Configuration

The Vite configuration is in `vite.config.mjs`:

- **Port**: 4028 (configurable)
- **Host**: 0.0.0.0 (accessible from network)
- **Build Output**: `dist/` directory
- **Chunk Size Warning**: 2000 KB

### Tailwind Configuration

Tailwind CSS is configured in `tailwind.config.js` with:
- Custom color palette
- Extended theme
- Plugin support (forms, typography, aspect-ratio, container-queries)

---

## 💻 Development

### Development Server

```bash
npm start
```

Features:
- Hot Module Replacement (HMR)
- Fast refresh
- Source maps
- Error overlay

### Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Preview production build
npm run serve
```

### Code Structure Guidelines

1. **Components**: Place reusable components in `src/components/`
2. **Pages**: Page components in `src/pages/`
3. **Services**: API calls in `src/services/`
4. **Hooks**: Custom hooks in `src/hooks/`
5. **Contexts**: React contexts in `src/contexts/`
6. **Utils**: Utility functions in `src/utils/`
7. **Styles**: Global styles in `src/styles/`

### Adding New Routes

1. Create page component in `src/pages/`
2. Import in `src/Routes.jsx`
3. Add route configuration:

```jsx
<Route 
  path="/new-page" 
  element={
    <ProtectedRoute>
      <NewPage />
    </ProtectedRoute>
  } 
/>
```

### Adding Protected Routes

Use the `ProtectedRoute` component:

```jsx
import { ProtectedRoute } from "components/ProtectedRoute";

<Route 
  path="/protected" 
  element={
    <ProtectedRoute>
      <ProtectedPage />
    </ProtectedRoute>
  } 
/>
```

### Role-Based Route Protection

For role-specific routes, create a wrapper component:

```jsx
const AdminOnlyRoute = () => {
  const { data } = useSession();
  const userRole = data?.user?.role?.toLowerCase();
  const isAdmin = userRole === 'admin';
  
  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <AdminPage />;
};
```

---

## 📁 Project Structure

```
frontend/
├── public/                          # Static assets
│   ├── assets/
│   │   └── images/                 # Image assets
│   ├── manifest.json               # PWA manifest
│   └── robots.txt                  # SEO robots file
│
├── src/
│   ├── components/                 # Reusable components
│   │   ├── ui/                    # UI primitives
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Checkbox.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── DarkModeToggle.jsx
│   │   ├── ProtectedRoute.jsx     # Route protection
│   │   ├── ErrorBoundary.jsx      # Error handling
│   │   ├── ScrollToTop.jsx        # Scroll behavior
│   │   ├── AppIcon.jsx            # App icons
│   │   ├── AppImage.jsx           # Image component
│   │   └── Tutorial/
│   │       └── OnboardingTutorial.jsx
│   │
│   ├── pages/                      # Page components
│   │   ├── landing/               # Landing page
│   │   ├── login/                 # Login page
│   │   ├── intelligent-dashboard/ # Main dashboard
│   │   ├── ai-diet-generator/     # AI diet generation
│   │   ├── patient-profile-builder/ # Patient profiles
│   │   ├── diet-plan-viewer/      # Diet plan viewing
│   │   ├── food-explorer/         # Food database
│   │   ├── progress-analytics/    # Analytics
│   │   ├── patient-records/       # Patient management
│   │   ├── past-diets/            # Historical diets
│   │   ├── remedies/              # Patient remedies
│   │   ├── reports/               # Reports
│   │   ├── help/                  # Help page
│   │   ├── NotFound.jsx           # 404 page
│   │   └── Unauthorized.jsx       # 403 page
│   │
│   ├── contexts/                  # React contexts
│   │   ├── AuthContext.jsx        # Authentication state
│   │   └── ThemeContext.jsx       # Theme management
│   │
│   ├── services/                  # API services
│   │   └── api.js                 # Axios instance & API calls
│   │
│   ├── hooks/                     # Custom hooks
│   │   └── useAuth.js             # Authentication hook
│   │
│   ├── lib/                       # Utilities
│   │   └── auth.js                # Auth utilities
│   │
│   ├── utils/                     # Helper functions
│   │   └── cn.js                  # Class name utility
│   │
│   ├── styles/                    # Global styles
│   │   ├── index.css              # Global CSS
│   │   └── tailwind.css           # Tailwind imports
│   │
│   ├── data/                      # Static data
│   │   └── institutes.js          # Institute data
│   │
│   ├── App.jsx                    # Root component
│   ├── Routes.jsx                 # Route configuration
│   └── index.jsx                  # Entry point
│
├── .env                           # Environment variables
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── vite.config.mjs                # Vite configuration
├── tailwind.config.js             # Tailwind configuration
├── postcss.config.js              # PostCSS configuration
└── jsconfig.json                  # JavaScript config
```

---

## 🗺️ Pages & Routes

### Public Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Landing` | Landing page |
| `/home` | `Landing` | Landing page alias |
| `/login` | `Login` | Login page |

### Protected Routes

| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/intelligent-dashboard` | `IntelligentDashboard` | All | Main dashboard |
| `/diet-plan-viewer` | `DietPlanViewer` | All | View diet plans |
| `/patient-profile-builder` | `PatientProfileBuilder` | All | Build patient profiles |
| `/food-explorer` | `FoodExplorer` | All | Explore food database |
| `/progress-analytics` | `ProgressAnalytics` | All | View analytics |
| `/ai-diet-generator` | `AIDietGenerator` | Admin, Practitioner | Generate AI diets |
| `/patient-records` | `PatientRecords` | Admin, Practitioner | Manage patients |
| `/past-diets` | `PastDiets` | Admin, Practitioner | View past diets |
| `/remedies` | `Remedies` | Patient | View remedies |
| `/reports` | `Reports` | Admin, Practitioner | Generate reports |
| `/help` | `Help` | All | Help documentation |

### Error Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/unauthorized` | `Unauthorized` | 403 Forbidden |
| `*` | `NotFound` | 404 Not Found |

---

## 🧩 Components

### UI Components

Located in `src/components/ui/`:

- **Button**: Reusable button component with variants
- **Input**: Form input with validation states
- **Select**: Dropdown select component
- **Checkbox**: Checkbox input
- **Header**: Application header with navigation
- **Sidebar**: Sidebar navigation
- **DarkModeToggle**: Theme switcher

### Layout Components

- **ProtectedRoute**: Route protection wrapper
- **ErrorBoundary**: Error catching boundary
- **ScrollToTop**: Scroll to top on route change

### Page-Specific Components

Each page has its own components directory:
- `ai-diet-generator/components/`: Diet generation components
- `diet-plan-viewer/components/`: Diet viewing components
- `food-explorer/components/`: Food exploration components
- etc.

---

## 🔄 State Management

### Redux Toolkit

Global state management using Redux Toolkit:

```jsx
import { useSelector, useDispatch } from 'react-redux';

// Access state
const data = useSelector((state) => state.someSlice.data);

// Dispatch actions
const dispatch = useDispatch();
dispatch(someAction());
```

### React Context

#### AuthContext

Authentication state management:

```jsx
import { useSession } from 'contexts/AuthContext';

const { data, isLoading, signIn, signOut } = useSession();
```

#### ThemeContext

Theme management:

```jsx
import { useTheme } from 'contexts/ThemeContext';

const { theme, toggleTheme } = useTheme();
```

---

## 🎨 Styling

### Tailwind CSS

The project uses Tailwind CSS for styling:

```jsx
<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800">
  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
    Title
  </h1>
</div>
```

### Custom Styles

Global styles in `src/styles/`:
- `index.css`: Global CSS and custom styles
- `tailwind.css`: Tailwind directives

### Dark Mode

Dark mode is implemented using Tailwind's dark mode:

```jsx
<div className="bg-white dark:bg-gray-800">
  <p className="text-gray-900 dark:text-white">Content</p>
</div>
```

Toggle dark mode using the `DarkModeToggle` component.

---

## 🔌 API Integration

### API Service

API calls are handled through `src/services/api.js`:

```jsx
import { authAPI, patientAPI, modelAPI } from 'services/api';

// Login
const response = await authAPI.login({
  email: 'user@example.com',
  password: 'password123',
  role: 'Admin'
});

// Get patients
const patients = await patientAPI.getAll();

// Generate diet plan
const dietPlan = await modelAPI.generateDietPlan(data);
```

### Axios Configuration

- Base URL from environment variable
- Automatic token injection
- Error handling and token refresh
- Request/response interceptors

### API Endpoints

See [ENDPOINTS.md](../ENDPOINTS.md) for complete API documentation.

---

## 🔐 Authentication

### Authentication Flow

1. User logs in via `/login` page
2. Credentials sent to `/api/auth/login`
3. JWT token received and stored in localStorage
4. Token included in all API requests
5. Protected routes check authentication
6. Token refreshed automatically when expired

### Using Authentication

```jsx
import { useSession } from 'contexts/AuthContext';

function MyComponent() {
  const { data, isLoading, signIn, signOut } = useSession();
  
  if (isLoading) return <div>Loading...</div>;
  
  if (!data) {
    // Not authenticated
    return <LoginForm onLogin={signIn} />;
  }
  
  // Authenticated
  return <div>Welcome, {data.user.name}!</div>;
}
```

### Protected Routes

```jsx
<Route 
  path="/protected" 
  element={
    <ProtectedRoute>
      <ProtectedPage />
    </ProtectedRoute>
  } 
/>
```

---

## 🏗️ Building for Production

### Build Command

```bash
npm run build
```

This will:
- Optimize and minify code
- Generate production bundle
- Create source maps
- Output to `dist/` directory

### Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── images/
└── manifest.json
```

### Preview Production Build

```bash
npm run serve
```

This starts a local server to preview the production build.

---

## 🚢 Deployment

### 🌐 Live Application

**Production Website**: [https://ayutra.vercel.app](https://ayutra.vercel.app)

The frontend is currently deployed and live at the above URL. The application is fully functional with all features accessible.

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Configure environment variables in Vercel dashboard:
   - `VITE_API_BASE_URL`: Your backend API URL

### Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy `dist/` directory to Netlify

3. Configure environment variables in Netlify dashboard

### Traditional Server

1. Build the project:
```bash
npm run build
```

2. Serve `dist/` directory with a web server (nginx, Apache, etc.)

3. Configure reverse proxy for API calls

### Environment Variables for Production

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_ENV=production
```

---

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use

**Issue**: Port 4028 is already in use

**Solution**: 
- Change port in `vite.config.mjs`:
```js
server: {
  port: 4029, // Change to available port
}
```

#### API Connection Errors

**Issue**: Cannot connect to backend API

**Solution**:
- Verify `VITE_API_BASE_URL` in `.env`
- Check backend server is running
- Verify CORS configuration in backend

#### Build Errors

**Issue**: Build fails with errors

**Solution**:
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript/ESLint errors
- Verify all dependencies are installed

#### Dark Mode Not Working

**Issue**: Dark mode toggle doesn't work

**Solution**:
- Verify `ThemeContext` is wrapping the app
- Check Tailwind dark mode configuration
- Verify `dark:` classes are used correctly

#### Authentication Issues

**Issue**: Login doesn't work or redirects incorrectly

**Solution**:
- Check browser console for errors
- Verify token is stored in localStorage
- Check API response format
- Verify backend authentication endpoint

### Getting Help

1. Check browser console for errors
2. Check network tab for API errors
3. Verify environment variables
4. Check backend server logs
5. Review [Backend README](../backend/README.md)

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Router Documentation](https://reactrouter.com/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)

---

## 🤝 Contributing

When contributing to the frontend:

1. Follow existing code style
2. Use functional components and hooks
3. Add PropTypes or TypeScript types
4. Write meaningful commit messages
5. Test your changes thoroughly
6. Update documentation if needed

---

## 📄 License

This project is licensed under the ISC License.

---

<div align="center">

**Built with ❤️ using React and Vite**

[Back to Top](#-ayutra---frontend-application)

</div>

