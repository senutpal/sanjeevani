# Sanjeevani

A modern, interactive hospital management system for managing hospital operations, streamlining patient care, and optimizing workflows for doctors and staff.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## Features
- Patient queue management
- Doctor visit scheduling and registration
- Real-time updates and notifications
- User-friendly, responsive UI
- Modular and extensible codebase

## Tech Stack
- **Frontend:** React, TypeScript, Vite
- **Styling/UI:** Tailwind CSS, shadcn-ui, CSS/SCSS, Lucide React Icons
- **State Management:** React Context API, React Query
- **Forms & Validation:** React Hook Form, Zod, @hookform/resolvers
- **Component Libraries:** Radix UI (various primitives), shadcn-ui, cmdk, embla-carousel-react
- **Backend/API:** Supabase (authentication, database, storage, real-time updates)
- **Notifications:** sonner
- **Data Visualization:** Recharts
- **Routing:** React Router DOM
- **Build & Tooling:** Vite, ESLint, TypeScript, PostCSS, Tailwind plugins
- **Other:** date-fns, class-variance-authority, clsx, next-themes, vaul


### Installation & Local Setup
1. **Clone the repository:**
   ```sh
   git clone <YOUR_GIT_URL>
   cd sanjeevani
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the development server:**
   ```sh
   npm run dev
   ```
4. **Open your browser:**
   Visit `http://localhost:5173` (or as indicated in your terminal).

### Usage
- Login or register as a user (if authentication is enabled).
- Access the dashboard to view and manage patient queues.
- Schedule or register doctor visits.
- Receive real-time updates as patient statuses change.
- Use the responsive UI for optimal experience on any device.

For any issues, please open an issue or contact the maintainer.

## Project Structure
```
careflow-hospital-dashboard/
├── public/             # Static assets
├── src/
│   ├── components/     # React components (e.g., PatientQueueCard, DoctorVisitForm)
│   ├── lib/
│   │   ├── api/        # API utilities (e.g., fetchData.ts)
│   │   └── types/      # TypeScript types
│   └── ...             # Other source files
├── package.json
├── README.md
└── ...
```

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your fork and open a Pull Request

Please follow code style guidelines and write clear commit messages.


