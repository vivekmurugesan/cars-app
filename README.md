# 🏎️ Cars App - Kids Learning Platform

A full-stack web application for kids aged ~10 to learn about cars and automobiles through interactive browsing, quizzes, and trivia facts.

## 📋 Project Overview

**Cars App** is a modern, kid-friendly platform that teaches children about cars and vehicles through:
- **Car Catalog**: Browse and search cars by brand, category, year, and performance specs
- **Personal Garage**: Save favorite cars to a collection
- **Quizzes**: Interactive quizzes about cars with immediate feedback and scoring
- **Trivia Facts**: Daily facts and educational content about automobiles
- **OTP Authentication**: Secure email-based login without passwords

### Tech Stack

**Frontend:**
- React 18+ (SPA)
- React Router v6 (Navigation)
- Zustand (State Management)
- Tailwind CSS (Styling)
- Axios (HTTP Client)

**Backend:**
- Java 17+
- Spring Boot 3.3.0
- Spring Data JPA
- Spring Security
- PostgreSQL
- Hibernate ORM

**DevOps:**
- Docker & Docker Compose
- Multi-container orchestration

## 🚀 Quick Start with Docker

### Prerequisites
- Docker & Docker Compose
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/vivekmurugesan/cars-app.git
   cd cars-app
   ```

2. **Build and start services**
   ```bash
   docker-compose build
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - pgAdmin: http://localhost:5050

4. **Verify setup**
   ```bash
   curl http://localhost:8080/actuator/health
   ```

## 🎯 Features

### Authentication
- OTP-based login via email
- User registration with interest selection
- JWT token support

### Car Browsing
- Search by brand/model
- Filter by category, year, top speed
- Detailed car information with facts
- Pagination support

### Personal Garage
- Add/remove favorite cars
- Persistent collection
- Browse all favorites

### Quizzes
- Multiple choice questions
- Score calculation
- Progress tracking
- Quiz categories

### Trivia
- Daily trivia facts
- Category and difficulty filtering
- Educational content

## 📁 Project Structure

```
cars-app/
├── frontend/          # React SPA
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/     # Zustand stores
│   │   └── services/  # API clients
│   └── package.json
├── backend/           # Spring Boot API
│   ├── src/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── entity/
│   │   └── repository/
│   └── pom.xml
├── database/          # DB initialization
│   └── init.sql
└── docker-compose.yml
```

## 📡 Key API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify and login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get profile

### Cars
- `GET /api/cars` - All cars
- `GET /api/cars/search?query=...` - Search cars
- `GET /api/cars/{id}` - Car details
- `GET /api/cars/category/{cat}` - By category

### Garage
- `GET /api/garage/{userId}` - User's cars
- `POST /api/garage/{userId}/add/{carId}` - Add car
- `DELETE /api/garage/{userId}/remove/{carId}` - Remove car

### Quizzes
- `GET /api/quiz` - All quizzes
- `GET /api/quiz/{id}` - Quiz details
- `POST /api/quiz/{id}/submit` - Submit answers

### Trivia
- `GET /api/trivia` - All trivia
- `GET /api/trivia/daily` - Daily fact

## 🌐 Frontend Pages

- **Home**: Dashboard with featured cars and daily trivia
- **Search**: Car catalog with filters and search
- **Car Details**: Detailed info with add-to-garage option
- **My Garage**: User's favorite cars collection
- **Quizzes**: Quiz selection and interactive interface
- **Trivia**: Trivia facts with category/difficulty filters
- **Profile**: User account and preferences
- **Login/Register**: Authentication flows

## 🛠️ Local Development

### Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 📊 Database Schema

Main tables:
- users, otps, car_brands, cars
- car_images, car_facts, user_garage
- quizzes, quiz_questions, quiz_options
- user_quiz_progress, trivia_facts, daily_trivia

## 🔐 Security

- CORS restricted to localhost
- OTP email verification
- JWT tokens
- Input validation
- SQL injection prevention

## 📝 Environment Setup

Create `.env` file:
```env
DB_PORT=5432
POSTGRES_PASSWORD=password

REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENV=development

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

## 🐛 Troubleshooting

**Frontend not loading?**
- Clear cache: `docker-compose build --no-cache frontend`

**Backend 404?**
- Check logs: `docker-compose logs backend`
- Verify health: `curl http://localhost:8080/actuator/health`

**Database issues?**
- Check status: `docker-compose ps`
- View logs: `docker-compose logs db`

## 🚀 Deployment

```bash
docker-compose -f docker-compose.yml up -d
```

For production, update:
- HTTPS/SSL configuration
- Database credentials
- Email service credentials
- CORS origins

---

**Created with ❤️ for kids learning about cars! 🏎️**
