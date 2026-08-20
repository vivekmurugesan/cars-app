# Cars App - Kids Learning Platform

A vibrant, interactive application designed for 10-year-old car enthusiasts to learn about automobiles through gamified content, engaging profiles, and personalized recommendations.

## Project Overview

This full-stack application combines:
- **Frontend**: React SPA with Tailwind CSS for kid-friendly UI
- **Backend**: Java Springboot RESTful API
- **Database**: PostgreSQL for data persistence
- **AI Integration**: Gemini/OpenAI API for dynamic content generation
- **Deployment**: Docker & docker-compose for easy setup

## Features

### Core Features
- **OTP-based Authentication**: Simple email login with one-time passwords
- **Personalized Feed**: Car of the Day, daily trivia, interest-based recommendations
- **Search & Discovery**: Filter cars by make, model, era, or category
- **Personal Garage**: Favorite cars and bookmark interesting facts
- **Car Profiles**: Detailed specs, images, historical significance, and audio clips
- **Gamified Learning**: Trivia flashcards and mini-quizzes with points and badges
- **Trending Section**: Real-time popular vehicles and concept cars
- **AI-Powered Content**: Age-appropriate facts, stories, and Q&A

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 18+ with Tailwind CSS |
| Backend | Java 17+ with Springboot 3.x |
| Database | PostgreSQL 14+ |
| ORM | JPA/Hibernate |
| AI Integration | Gemini API / OpenAI API |
| Containerization | Docker & docker-compose |

## Project Structure

```
cars-app/
├── frontend/              # React SPA
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/              # Java Springboot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
├── database/             # SQL scripts
│   └── init.sql
├── docker/              # Docker configurations
│   └── Dockerfile
├── docker-compose.yml   # Multi-container setup
└── docs/               # Documentation
```

## Quick Start

### Prerequisites
- Docker & docker-compose
- Node.js 18+ (for local frontend development)
- Java 17+ (for local backend development)
- PostgreSQL 14+ (for local database)

### Using Docker Compose (Recommended)

```bash
# Clone and navigate to project
cd cars-app

# Start all services
docker-compose up -d

# Access the app
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
# Database: localhost:5432
```

### Local Development

#### Frontend
```bash
cd frontend
npm install
npm start
```

#### Backend
```bash
cd backend
mvn clean spring-boot:run
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP and login
- `POST /api/auth/logout` - Logout user

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/interests` - Update car interests

### Car Endpoints
- `GET /api/cars` - List cars with filters
- `GET /api/cars/{id}` - Get car details
- `GET /api/cars/trending` - Get trending cars
- `GET /api/cars/daily` - Car of the Day

### Garage Endpoints
- `GET /api/garage` - Get user's favorite cars
- `POST /api/garage/{carId}` - Add car to garage
- `DELETE /api/garage/{carId}` - Remove from garage

### Trivia & Quiz Endpoints
- `GET /api/trivia/daily` - Daily trivia facts
- `GET /api/quiz` - Get quizzes
- `POST /api/quiz/{id}/submit` - Submit quiz answers

### Search Endpoints
- `GET /api/search/cars` - Search cars with filters
- `GET /api/search/suggestions` - Auto-suggestions

## Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://postgres:password@db:5432/cars_app
DATABASE_USER=postgres
DATABASE_PASSWORD=password

# AI Integration
AI_API_KEY=your_gemini_or_openai_key
AI_PROVIDER=gemini  # or openai

# Backend
JAVA_ENV=production
SERVER_PORT=8080

# Frontend
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENV=production
```

## Database Schema

The database includes tables for:
- **users**: User accounts and authentication
- **user_interests**: Car brands and categories of interest
- **cars**: Car catalog with specs and metadata
- **car_images**: High-quality car images
- **car_facts**: Interesting facts about cars
- **garage**: User favorite cars
- **quizzes**: Quiz questions and answers
- **quiz_progress**: User quiz performance
- **trivia**: Daily trivia facts
- **user_bookmarks**: Bookmarked facts and content

## Development Workflow

1. **Frontend Development**: React components with kid-friendly design
2. **Backend Development**: RESTful API endpoints with proper validation
3. **Database**: SQL migrations for schema updates
4. **Testing**: Unit tests for both frontend and backend
5. **Deployment**: Docker containers for production

## Security Considerations

- OTP-based authentication (no passwords stored)
- Input validation on all endpoints
- Rate limiting on API endpoints
- HTTPS in production
- Safe AI content filtering for kids
- CORS configuration for frontend communication
- Environment-based configuration (no secrets in code)

## Deployment

### Docker Deployment

```bash
# Build images
docker-compose build

# Run containers
docker-compose up -d

# View logs
docker-compose logs -f
```

### Production Checklist
- [ ] Set strong database password
- [ ] Configure AI API keys
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring and logging
- [ ] Configure backups
- [ ] Set up CI/CD pipeline

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Proprietary - All rights reserved

## Support

For issues or questions, contact the development team.

---

**Last Updated**: August 2026
