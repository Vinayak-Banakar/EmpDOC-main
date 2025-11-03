# 📋 EmpDOC - Employee Management System

## 🎯 Overview

**EmpDOC (PeopleOps)** is a full-stack employee management system with role-based access control, real-time salary analytics, audit logging, and secure JWT authentication.

### ✨ Key Features

- ✅ **Secure Authentication** - JWT-based login/signup with bcryptjs password hashing
- ✅ **Role-Based Access Control (RBAC)** - HR vs Employee roles with different permissions
- ✅ **Employee Management** - Create, read, update, delete employee records
- ✅ **Salary Analytics** - Visual charts and insights on salary distribution
- ✅ **Auto Experience Calculation** - Years & months calculated from date of joining
- ✅ **Audit Logging** - Track all CRUD operations for compliance
- ✅ **Avatar Upload** - File upload support for employee profiles
- ✅ **Real-time Dashboard** - Live employee directory with filters
- ✅ **Responsive UI** - Built with Radix UI & Tailwind CSS

---

## 🏗️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript | Interactive UI |
| **Bundler** | Vite 7 | Dev server & build optimization |
| **UI Framework** | Radix UI + Tailwind CSS | Pre-built accessible components & styling |
| **HTTP Client** | Axios | API requests with JWT interceptor |
| **State Management** | React Context API | Global auth state |
| **Backend** | Express 5 | REST API server |
| **Database** | MongoDB | Document-based data storage |
| **ORM** | Mongoose | MongoDB schema validation & queries |
| **Auth** | JWT + bcryptjs | Secure token-based authentication |
| **File Upload** | Multer | Multipart form data handling |
| **Charts** | Recharts | Data visualization |

---

## 📁 Project Structure

```
EmpDOC-main/
├── client/                        # React Frontend
│   ├── App.tsx                   # Main React App with routing
│   ├── pages/
│   │   ├── Index.tsx             # Dashboard/Login page
│   │   └── NotFound.tsx          # 404 page
│   ├── components/
│   │   ├── AuthCard.tsx          # Login/Signup form
│   │   ├── EmployeeForm.tsx      # Add/Edit employee form
│   │   ├── EmployeeTable.tsx     # Employees list table
│   │   ├── SalaryCharts.tsx      # Salary analytics charts
│   │   └── ui/                   # Radix UI component library
│   ├── hooks/
│   │   ├── use-auth.tsx          # Auth context provider
│   │   └── use-mobile.tsx        # Mobile detection hook
│   ├── lib/
│   │   ├── api.ts                # Axios instance + JWT interceptor
│   │   └── utils.ts              # Utility functions
│   └── global.css                # Tailwind + global styles
│
├── server/                        # Node.js Backend
│   ├── index.ts                  # Express app creation
│   ├── middleware/
│   │   ├── auth.ts               # JWT verification & RBAC
│   │   └── db.ts                 # Database connection check
│   ├── models/
│   │   └── index.ts              # Mongoose schemas (User, Employee, AuditLog)
│   ├── routes/
│   │   ├── auth.ts               # POST /auth/signup, /auth/login
│   │   ├── employees.ts          # GET/POST/PUT/DELETE /employees
│   │   ├── dashboard.ts          # GET /dashboard (analytics)
│   │   └── demo.ts               # GET /demo (health check)
│   └── utils/
│       └── experience.ts         # Calculate work experience from DOJ
│
├── shared/                        # Shared code
│   └── api.ts                    # Shared TypeScript types
│
├── public/                        # Static files
│   └── robots.txt
│
├── Configuration Files
│   ├── vite.config.ts            # Vite dev server + Express integration
│   ├── vite.config.server.ts     # Vite backend build config
│   ├── tsconfig.json             # TypeScript configuration
│   ├── tailwind.config.ts        # Tailwind CSS configuration
│   ├── postcss.config.js         # PostCSS configuration
│   ├── package.json              # Dependencies & scripts
│   ├── .env                      # Environment variables
│   ├── .gitignore                # Git ignore rules
│   ├── .npmrc                    # NPM configuration
│   ├── .prettierrc               # Code formatting rules
│   ├── index.html                # HTML entry point
│   └── netlify.toml              # Netlify deployment config
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ ([download](https://nodejs.org/))
- **MongoDB** ([download](https://www.mongodb.com/try/download/community))
- **npm** or **pnpm** package manager

### Installation

1. **Clone the repository**
   ```bash
   cd EmpDOC-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Update `.env` file:
   ```properties
   MONGO_URI=mongodb://localhost:27017/empdoc
   JWT_SECRET=your_super_secret_jwt_key_change_this
   PING_MESSAGE=ping pong
   ```

4. **Ensure MongoDB is running**
   ```bash
   # For Windows (if installed as service)
   Get-Service MongoDB
   
   # For macOS
   brew services list | grep mongodb
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at: **http://localhost:8080**

---

## 📚 Available Scripts

```bash
# Development
npm run dev                 # Start dev server with hot reload

# Production Build
npm run build              # Build both frontend & backend
npm run build:client       # Build React frontend only
npm run build:server       # Build Express backend only

# Production Run
npm start                  # Run compiled backend server

# Testing & Quality
npm run test              # Run unit tests with Vitest
npm run format.fix        # Format code with Prettier
npm run typecheck         # Type check with TypeScript

# Clean
npm run clean             # Remove dist folder
```

---

## 🔐 Database Models

### 1. **User** Collection
Stores login credentials and role information.

```typescript
{
  _id: ObjectId,
  email: string (unique, indexed),
  passwordHash: string,
  role: "HR" | "Employee",
  createdAt: Date,
  updatedAt: Date
}
```

### 2. **Employee** Collection
Stores employee profile information.

```typescript
{
  _id: ObjectId,
  owner: ObjectId (ref to User),
  name: string,
  dateOfJoining: Date,
  salary: number,
  avatar: {
    data: Buffer,
    contentType: string,
    filename: string,
    size: number
  },
  experienceYears: number (virtual - calculated),
  experienceMonths: number (virtual - calculated),
  createdAt: Date,
  updatedAt: Date
}
```

### 3. **AuditLog** Collection
Tracks all CRUD operations for compliance & debugging.

```typescript
{
  _id: ObjectId,
  user: ObjectId (ref to User - who performed action),
  action: "CREATE" | "READ" | "UPDATE" | "DELETE",
  targetType: "Employee" | "User",
  targetId: ObjectId (what was modified),
  meta: any (additional context),
  createdAt: Date
}
```

---

## 🔑 API Endpoints

### Authentication

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/auth/signup` | `{email, password, role}` | `{token, user: {id, email, role}}` |
| POST | `/api/auth/login` | `{email, password}` | `{token, user: {id, email, role}}` |

### Employees

| Method | Endpoint | Permission | Purpose |
|--------|----------|-----------|---------|
| GET | `/api/employees` | HR (all) / Employee (own) | List employees |
| POST | `/api/employees` | HR / Employee (own) | Create employee |
| GET | `/api/employees/:id` | HR (all) / Employee (own) | Get single employee |
| PUT | `/api/employees/:id` | HR (all) / Employee (own) | Update employee |
| DELETE | `/api/employees/:id` | HR only | Delete employee |
| GET | `/api/employees/:id/avatar` | HR (all) / Employee (own) | Download avatar |

### Dashboard

| Method | Endpoint | Permission | Purpose |
|--------|----------|-----------|---------|
| GET | `/api/dashboard/stats` | HR only | Salary statistics |
| GET | `/api/dashboard/chart-data` | HR only | Chart data for visualization |

### Health Check

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/ping` | Server health check |
| GET | `/api/demo` | Demo endpoint |

---

## 🎭 Role-Based Permissions

### HR User Can:
- ✅ View all employees in the directory
- ✅ Create new employee records
- ✅ Edit any employee's profile
- ✅ Delete employee records
- ✅ View salary analytics & charts
- ✅ Access audit logs
- ✅ Assign roles during employee creation

### Employee User Can:
- ✅ View & edit only their own profile
- ✅ Upload their own avatar
- ✅ See their own details (name, salary, DOJ, experience)
- ❌ Cannot view other employees
- ❌ Cannot create/delete records
- ❌ Cannot access analytics

---

## 🔄 Authentication Flow

```
1. SIGNUP
   User fills form → POST /api/auth/signup
   → Validate email & password
   → Hash password with bcryptjs
   → Create User in MongoDB
   → Generate JWT token {userId}
   → Send token to client
   → Client stores in localStorage

2. LOGIN
   User enters email & password → POST /api/auth/login
   → Find User by email
   → Compare password hash
   → Generate JWT token
   → Send token to client
   → Client stores in localStorage

3. EVERY API REQUEST
   Client adds header: Authorization: Bearer <token>
   → Express middleware verifies JWT
   → Extracts userId from token
   → Queries User from MongoDB
   → Attaches user to req.user
   → Route handler processes request with user context

4. LOGOUT
   Clear localStorage & auth state
   → Token is no longer sent
   → User is not authenticated
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    BROWSER (Client)                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ React App (Index.tsx)                                 │  │
│  │ ┌─────────────────────────────────────────────────┐  │  │
│  │ │ AuthProvider (use-auth.tsx)                     │  │  │
│  │ │ - Stores token & user in Context               │  │  │
│  │ │ - Syncs with localStorage                       │  │  │
│  │ └─────────────────────────────────────────────────┘  │  │
│  │         ↓                                             │  │
│  │ ┌─────────────────────────────────────────────────┐  │  │
│  │ │ Components (AuthCard, EmployeeTable, etc.)     │  │  │
│  │ │ - useAuth() hook to get token                   │  │  │
│  │ │ - Call api.get/post/put/delete                  │  │  │
│  │ └─────────────────────────────────────────────────┘  │  │
│  │         ↓                                             │  │
│  │ ┌─────────────────────────────────────────────────┐  │  │
│  │ │ api.ts (Axios instance)                         │  │  │
│  │ │ - Interceptor adds JWT header                   │  │  │
│  │ │ - baseURL: /api                                 │  │  │
│  │ └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │
                   HTTP Request with JWT
                             │
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                 NODE.JS SERVER (Express)                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ vite.config.ts expressPlugin()                        │  │
│  │ - Integrates Express with Vite dev server            │  │
│  └───────────────────────────────────────────────────────┘  │
│         ↓                                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ server/index.ts (Express App)                         │  │
│  │ - CORS enabled                                        │  │
│  │ - JSON/URL body parser                               │  │
│  └───────────────────────────────────────────────────────┘  │
│         ↓                                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ server/middleware/auth.ts (authRequired)              │  │
│  │ - Extract JWT from Authorization header              │  │
│  │ - Verify signature using JWT_SECRET                  │  │
│  │ - Query User from MongoDB using userId               │  │
│  │ - Attach user to req.user                            │  │
│  └───────────────────────────────────────────────────────┘  │
│         ↓                                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ server/routes/* (API Routes)                          │  │
│  │ - Check RBAC (req.user.role)                          │  │
│  │ - Query MongoDB models                               │  │
│  │ - Return JSON response                               │  │
│  └───────────────────────────────────────────────────────┘  │
│         ↓                                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ server/middleware/audit.ts (logAudit)                │  │
│  │ - Record action to AuditLog collection               │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │
                        MongoDB
                             │
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                    MONGODB DATABASE                         │
│  ├─ users (User collection)                                │
│  ├─ employees (Employee collection)                        │
│  └─ auditlogs (AuditLog collection)                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔍 Request/Response Examples

### Example 1: Sign Up

**Request:**
```bash
POST http://localhost:8080/api/auth/signup
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "role": "Employee"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "role": "Employee"
  }
}
```

### Example 2: Create Employee (HR Only)

**Request:**
```bash
POST http://localhost:8080/api/employees
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data

{
  "name": "Jane Doe",
  "dateOfJoining": "2023-06-15",
  "salary": 75000,
  "avatar": <file>
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "owner": "507f1f77bcf86cd799439011",
  "name": "Jane Doe",
  "dateOfJoining": "2023-06-15T00:00:00.000Z",
  "salary": 75000,
  "experienceYears": 1,
  "experienceMonths": 4,
  "avatar": null,
  "createdAt": "2025-11-01T16:30:00.000Z",
  "updatedAt": "2025-11-01T16:30:00.000Z"
}
```

### Example 3: List Employees

**Request:**
```bash
GET http://localhost:8080/api/employees?name=Jane&minSalary=50000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**
- `name` - Filter by name (partial match)
- `minSalary` - Minimum salary filter
- `maxSalary` - Maximum salary filter
- `minExpMonths` - Minimum experience in months
- `maxExpMonths` - Maximum experience in months

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "owner": "507f1f77bcf86cd799439011",
    "name": "Jane Doe",
    "dateOfJoining": "2023-06-15T00:00:00.000Z",
    "salary": 75000,
    "experienceYears": 1,
    "experienceMonths": 4,
    "createdAt": "2025-11-01T16:30:00.000Z",
    "updatedAt": "2025-11-01T16:30:00.000Z"
  }
]
```

---

## 🎯 Key Concepts

### **Virtual Fields**
- `experienceYears` and `experienceMonths` are **calculated on-the-fly**
- Not stored in database, computed from `dateOfJoining`
- Automatically included in API responses via Mongoose virtuals

### **JWT Token Structure**
```
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "userId": "507f1f77bcf86cd799439011",
  "iat": 1698855000,
  "exp": 1699459800
}

Signature: HMACSHA256(base64(header) + "." + base64(payload), JWT_SECRET)
```

### **Password Hashing**
- Passwords hashed with bcryptjs (salt rounds: 10)
- Never stored in plain text
- Verified during login using `bcrypt.compare()`

### **Audit Logging**
- Every CRUD operation logged to AuditLog collection
- Tracks: who did what, when, and to which record
- Useful for compliance, debugging, and accountability

### **File Uploads**
- Avatar images stored as binary data in MongoDB
- Handled by multer middleware (5MB max size)
- Retrieved via `/api/employees/:id/avatar` endpoint

---

## 🚨 Error Handling

All errors return appropriate HTTP status codes:

| Status | Meaning | Example |
|--------|---------|---------|
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | Invalid credentials or missing token |
| 403 | Forbidden | Insufficient permissions (e.g., Employee trying to view other's data) |
| 404 | Not Found | Employee record doesn't exist |
| 409 | Conflict | Email already registered |
| 503 | Service Unavailable | Database connection failed |

---

## 🔒 Security Features

- ✅ **JWT Authentication** - Stateless token-based auth
- ✅ **Password Hashing** - bcryptjs with salt rounds
- ✅ **HTTPS Ready** - Can be deployed behind reverse proxy
- ✅ **CORS Enabled** - Configured for frontend domain
- ✅ **Request Validation** - Input validation on all endpoints
- ✅ **Role-Based Access** - RBAC middleware enforces permissions
- ✅ **Audit Trails** - All operations logged for compliance

---

## 📦 Deployment

### Environment Variables for Production

```properties
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/empdoc
JWT_SECRET=generate_a_very_long_random_string_here
NODE_ENV=production
```

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Netlify

The project includes `netlify.toml` configuration. Connect your GitHub repo to Netlify for automatic deployments.

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
Get-Service MongoDB          # Windows
brew services list | grep mongodb  # macOS

# Verify connection string in .env
MONGO_URI=mongodb://localhost:27017/empdoc
```

### Port 8080 Already in Use
```bash
# Find process using port 8080
netstat -ano | findstr :8080

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### JWT Verification Failed
- Ensure `JWT_SECRET` is consistent across restarts
- Check Authorization header format: `Bearer <token>`
- Token might be expired (expires in 7 days)

---

## 📝 License

This project is open source and available under the MIT License.

---

## 👥 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ by the EmpDOC Team**