# 🛠️ Development Guide

## Project Setup

### Prerequisites
- Node.js 18+
- Java 17+
- PostgreSQL 14+
- Maven 3.6+
- Docker & Docker Compose

## Backend Development

### Prerequisites Setup
1. Install Java 17
2. Install Maven
3. PostgreSQL running

### Build & Run

```bash
cd backend

# Build
mvn clean install

# Run
mvn spring-boot:run

# Run specific profile
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# Run tests
mvn test
mvn test -Dtest=ClassName
mvn test -DfailIfNoTests=false
```

### Project Structure
```
backend/src/main/java/com/carsapp/
├── controller/           # REST endpoints
├── service/             # Business logic
├── entity/              # JPA entities
├── repository/          # Data access
├── dto/                 # Transfer objects
├── exception/           # Exception handling
└── CarsAppApplication.java  # Main class
```

### Key Dependencies
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- spring-boot-starter-security
- spring-boot-starter-mail
- postgresql
- jjwt (JWT)
- lombok

### Configuration
- `application.yml`: Database, mail, JPA config
- `pom.xml`: Maven dependencies

### Common Tasks

**Add new entity:**
1. Create entity class in `entity/`
2. Create repository in `repository/`
3. Create service in `service/`
4. Create controller in `controller/`
5. Add DTO in `dto/`

**Add new API endpoint:**
1. Add method to service
2. Add endpoint to controller
3. Test with curl/Postman

**Database changes:**
1. Modify entity
2. Update `database/init.sql`
3. Re-initialize database

## Frontend Development

### Prerequisites Setup
1. Install Node.js 18+
2. npm comes with Node.js

### Build & Run

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm start

# Build for production
npm run build

# Run tests
npm test

# Linting
npm run lint
```

### Project Structure
```
frontend/src/
├── components/        # Reusable React components
│   ├── common/       # Shared components
│   └── auth/         # Auth components
├── pages/            # Page components
├── store/            # Zustand stores
├── services/         # API clients
├── styles/           # CSS files
└── App.jsx           # Main app component
```

### Key Dependencies
- react 18
- react-router-dom v6
- zustand
- axios
- tailwindcss
- react-hot-toast
- react-query

### State Management (Zustand)

**Create new store:**
```javascript
import { create } from 'zustand';

const useMyStore = create((set) => ({
  state: null,
  action: async () => {
    set({ state: newState });
  },
}));

export default useMyStore;
```

**Use store in component:**
```javascript
const { state, action } = useMyStore();
```

### API Services

**Create new service:**
```javascript
// services/myService.js
import api from './api';

const myService = {
  getItems: () => api.get('/endpoint'),
  createItem: (data) => api.post('/endpoint', data),
};

export default myService;
```

### Common Tasks

**Add new page:**
1. Create component in `pages/`
2. Add route in `App.jsx`
3. Create store if needed
4. Use service for API calls

**Add new component:**
1. Create in `components/`
2. Import and use in pages

**Add new service:**
1. Create in `services/`
2. Create corresponding store
3. Use in components

## Docker Development

### Build Locally
```bash
# Build all
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend

# No cache rebuild
docker-compose build --no-cache backend
```

### Run Services
```bash
# Start all
docker-compose up -d

# View logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Remove volumes
docker-compose down -v
```

### Service Communication
- Frontend → Backend: http://backend:8080
- Backend → Database: jdbc:postgresql://db:5432/cars_app
- From host → Services: localhost:PORT

## Database Management

### Initialization
- Script: `database/init.sql`
- Auto-runs on first container start

### Access Database

**Via pgAdmin:**
- URL: http://localhost:5050
- Email: admin@example.com
- Password: admin

**Via psql:**
```bash
psql -h localhost -U postgres -d cars_app
```

**Common queries:**
```sql
-- List tables
\dt

-- Show schema
\d table_name

-- Query data
SELECT * FROM users;

-- Count records
SELECT COUNT(*) FROM cars;
```

### Reset Database
```bash
# Stop and remove volumes
docker-compose down -v

# Restart
docker-compose up -d
```

## Testing

### Backend Tests
```bash
cd backend

# All tests
mvn test

# Specific test class
mvn test -Dtest=UserServiceTest

# Specific test method
mvn test -Dtest=UserServiceTest#testCreateUser
```

### Frontend Tests
```bash
cd frontend

# All tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Integration Testing
```bash
# Ensure all services running
docker-compose up -d

# Test endpoints
curl http://localhost:8080/actuator/health
curl http://localhost:3000

# API testing
curl -X GET http://localhost:8080/api/cars
curl -X POST http://localhost:8080/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## Debugging

### Backend
```bash
# Run with debug port 5005
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005"

# Connect IDE debugger to localhost:5005
```

### Frontend
- Use React DevTools browser extension
- Console for errors: F12
- Zustand DevTools for state inspection

### Logs
```bash
# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Follow specific service
docker-compose logs --tail=100 -f backend
```

## Code Style

### Backend (Java)
- Use lombok for getters/setters
- Follow Spring conventions
- Document public methods
- Use meaningful variable names

### Frontend (JavaScript)
- Use functional components
- Use hooks for logic
- Prop validation with PropTypes
- Meaningful function/variable names

### Git Workflow
1. Create feature branch: `git checkout -b feature/name`
2. Make changes and commit
3. Push: `git push -u origin feature/name`
4. Create PR

## Environment Variables

### Backend (.env)
```env
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/cars_app
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=password
MAIL_HOST=smtp.gmail.com
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-password
```

### Frontend (.env.local)
```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENV=development
```

## Performance Optimization

### Backend
- Enable query optimization
- Use database indexes
- Cache frequently accessed data
- Use pagination for large results

### Frontend
- Code splitting with React.lazy
- Optimize images
- Minimize bundle size
- Use React.memo for expensive components

## Deployment Checklist

- [ ] All tests passing
- [ ] Code reviewed
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] API endpoints tested
- [ ] Frontend builds successfully
- [ ] CORS configured correctly
- [ ] Security settings configured
- [ ] Logs monitoring set up
- [ ] Backups configured

## Useful Commands

```bash
# Clean everything and restart
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d

# Rebuild and restart specific service
docker-compose build --no-cache backend
docker-compose up -d backend

# View all containers
docker-compose ps

# Execute command in container
docker-compose exec backend bash
docker-compose exec frontend bash

# View resource usage
docker stats

# Remove unused images
docker image prune

# Format Java code
mvn fmt:format

# Check frontend code
npm run lint
npm run lint -- --fix
```

---

**Happy Developing! 🚀**
