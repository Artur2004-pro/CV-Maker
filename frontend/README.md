# CV Maker Frontend

A modern, responsive frontend for the CV Maker application built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### Authentication System
- **Login/Register** with JWT authentication
- **Protected Routes** with automatic redirects
- **Session Management** with localStorage persistence
- **Beautiful UI** with glass morphism effects

### CV Creation & Editing
- **Multi-step Form** for personal information, experience, education, and skills
- **Real-time Preview** of CV content
- **Dynamic Sections** - add/remove experience, education, skills
- **Form Validation** with error handling
- **Auto-save** functionality

### Template System
- **Template Gallery** with filtering and search
- **Template Categories** - Modern, Classic, Creative, Professional
- **Template Selection** with visual previews
- **Premium Templates** support

### PDF Generation
- **High-Quality PDF** export using jsPDF and html2canvas
- **Customizable Options** - format, margins, photo inclusion
- **Instant Download** functionality

### Dashboard
- **Quick Actions** for creating new CVs
- **Recent CVs** management
- **User Profile** integration
- **Navigation** to all features

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **React Hook Form** - Form management
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **jsPDF** - PDF generation
- **html2canvas** - HTML to image conversion

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── ProButton.tsx
│   │   ├── ProInput.tsx
│   │   └── ProCard.tsx
│   ├── auth/              # Authentication components
│   ├── cv/                # CV-related components
│   └── templates/         # Template components
├── pages/
│   ├── auth/              # Authentication pages
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── dashboard/         # Dashboard page
│   ├── editor/            # CV editor page
│   └── templates/         # Templates page
├── hooks/
│   └── useAuth.ts         # Authentication hook
├── services/
│   └── apiClient.ts       # API client
├── types/
│   └── api.ts             # TypeScript types
├── utils/
│   └── pdfGenerator.ts    # PDF generation utility
├── App.tsx                # Main app component
├── main.tsx              # Entry point
└── router.tsx            # Route configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 📦 Build & Deploy

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🔧 Configuration

### Backend Integration

The frontend is configured to work with the backend API at `http://localhost:3000/api`. Make sure your backend server is running for full functionality.

### API Endpoints Used

- `POST /api/auth/login` - User authentication
- `POST /api/auth/signup` - User registration
- `GET /api/templates` - Get available templates
- `POST /api/cv/generate` - Generate PDF (if implemented in backend)

## 🎨 UI Components

### ProButton
Reusable button component with multiple variants:
- `primary`, `secondary`, `accent`, `outline`, `ghost`
- Loading states
- Size variations

### ProInput
Enhanced input component with:
- Label and error handling
- Icon support
- Glass morphism variant

### ProCard
Flexible card component with:
- Multiple variants (default, glass, elevated)
- Responsive design

## 🔐 Authentication

The frontend uses JWT tokens for authentication:

1. **Login/Registration** - Credentials sent to backend
2. **Token Storage** - JWT stored in localStorage
3. **Auto-Login** - Token validated on app load
4. **Protected Routes** - Automatic redirect to login if not authenticated
5. **Logout** - Token cleared and user redirected

## 📄 PDF Generation

The frontend includes client-side PDF generation:

1. **HTML to Canvas** - Convert CV content to image
2. **Canvas to PDF** - Generate PDF using jsPDF
3. **Download** - Automatic file download
4. **Customization** - Format, margins, and options

## 🎯 Features in Detail

### CV Editor
- **Personal Information** - Name, contact details, summary
- **Experience** - Work history with dates and descriptions
- **Education** - Academic background with degrees
- **Skills** - Technical and soft skills with levels
- **Languages** - Spoken languages with proficiency
- **Certificates** - Professional certifications

### Template System
- **Gallery View** - Visual template selection
- **Filtering** - By category and search
- **Preview** - Template thumbnails
- **Premium Support** - Distinguish free vs premium

### Dashboard
- **Welcome Section** - Personalized greeting
- **Quick Actions** - Easy access to main features
- **Recent CVs** - Quick access to saved resumes
- **User Menu** - Settings and logout

## 🔄 Navigation Flow

1. **Landing** → Login/Register
2. **Login** → Dashboard
3. **Dashboard** → Editor/Templates
4. **Editor** → Create/Edit CV
5. **Templates** → Select Template → Editor
6. **Editor** → Download PDF

## 🎨 Design System

### Colors
- **Primary**: Indigo (#6366f1)
- **Secondary**: Purple (#a855f7)
- **Accent**: Pink (#ec4899)
- **Neutral**: Gray shades

### Typography
- **Headings**: Inter, bold
- **Body**: Inter, regular
- **UI**: System fonts

### Effects
- **Glass Morphism** - Blurred backgrounds
- **Gradients** - Color transitions
- **Animations** - Smooth transitions
- **Hover States** - Interactive feedback

## 📱 Responsive Design

- **Mobile** - 320px and up
- **Tablet** - 768px and up
- **Desktop** - 1024px and up
- **Large Desktop** - 1280px and up

## 🚀 Performance

- **Code Splitting** - Automatic with Vite
- **Tree Shaking** - Unused code removal
- **Image Optimization** - Lazy loading
- **CSS Optimization** - Purge unused styles

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

- **TypeScript** - Type safety
- **ESLint** - Code linting
- **Prettier** - Code formatting (recommended)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the backend API documentation
2. Verify environment variables
3. Check browser console for errors
4. Ensure backend is running on correct port
