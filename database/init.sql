-- Cars App Database Initialization Script
-- PostgreSQL

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create enum types
CREATE TYPE car_category AS ENUM (
    'SUPERCAR',
    'MUSCLE_CAR',
    'ELECTRIC_VEHICLE',
    'SPORTS_CAR',
    'SEDAN',
    'SUV',
    'CLASSIC_CAR',
    'CONCEPT_CAR',
    'HYPERCARS'
);

-- Note: user_interest ENUM type removed to allow string values from JPA
-- The backend sends strings like 'LEARN_ABOUT_CARS' which are stored as VARCHAR

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OTPs table
CREATE TABLE otps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    code VARCHAR(6) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User interests table
CREATE TABLE user_interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    interest VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, interest)
);

-- Car brands table
CREATE TABLE car_brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    country VARCHAR(100),
    founded_year INTEGER,
    description TEXT,
    logo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cars table
CREATE TABLE cars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES car_brands(id),
    model VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    category car_category NOT NULL,
    top_speed INTEGER,
    horsepower INTEGER,
    zero_to_sixty_time DECIMAL(4, 2),
    description TEXT,
    historical_significance TEXT,
    fun_fact TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(brand_id, model, year)
);

-- Car images table
CREATE TABLE car_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Car facts table
CREATE TABLE car_facts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    fact TEXT NOT NULL,
    fact_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Car audio clips table
CREATE TABLE car_audio_clips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    audio_url VARCHAR(500) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User garage (favorites) table
CREATE TABLE user_garage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, car_id)
);

-- Trivia facts table
CREATE TABLE trivia_facts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fact TEXT NOT NULL,
    difficulty VARCHAR(20),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily trivia table
CREATE TABLE daily_trivia (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trivia_id UUID NOT NULL REFERENCES trivia_facts(id),
    trivia_date DATE NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quizzes table
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty VARCHAR(20),
    category VARCHAR(100),
    points_reward INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz questions table
CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    question_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(quiz_id, question_order)
);

-- Quiz options table
CREATE TABLE quiz_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    option_order INTEGER NOT NULL,
    UNIQUE(question_id, option_order)
);

-- User quiz progress table
CREATE TABLE user_quiz_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    score INTEGER,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, quiz_id)
);

-- User bookmarks table
CREATE TABLE user_bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    car_fact_id UUID REFERENCES car_facts(id) ON DELETE CASCADE,
    trivia_fact_id UUID REFERENCES trivia_facts(id) ON DELETE CASCADE,
    bookmark_type VARCHAR(50) NOT NULL,
    bookmarked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User badges/achievements table
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_name VARCHAR(100) NOT NULL,
    badge_description TEXT,
    badge_icon_url VARCHAR(500),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_name)
);

-- User points/scores table
CREATE TABLE user_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Trending cars cache table
CREATE TABLE trending_cars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(car_id)
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_otps_email ON otps(email);
CREATE INDEX idx_otps_expires_at ON otps(expires_at);
CREATE INDEX idx_user_interests_user_id ON user_interests(user_id);
CREATE INDEX idx_cars_brand_id ON cars(brand_id);
CREATE INDEX idx_cars_category ON cars(category);
CREATE INDEX idx_cars_year ON cars(year);
CREATE INDEX idx_car_images_car_id ON car_images(car_id);
CREATE INDEX idx_car_facts_car_id ON car_facts(car_id);
CREATE INDEX idx_car_audio_clips_car_id ON car_audio_clips(car_id);
CREATE INDEX idx_user_garage_user_id ON user_garage(user_id);
CREATE INDEX idx_user_garage_car_id ON user_garage(car_id);
CREATE INDEX idx_daily_trivia_date ON daily_trivia(trivia_date);
CREATE INDEX idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX idx_quiz_options_question_id ON quiz_options(question_id);
CREATE INDEX idx_user_quiz_progress_user_id ON user_quiz_progress(user_id);
CREATE INDEX idx_user_quiz_progress_quiz_id ON user_quiz_progress(quiz_id);
CREATE INDEX idx_user_bookmarks_user_id ON user_bookmarks(user_id);
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_user_points_user_id ON user_points(user_id);

-- Sample data for testing
INSERT INTO car_brands (name, country, founded_year, description, logo_url)
VALUES
    ('Ferrari', 'Italy', 1947, 'Legendary Italian supercar manufacturer', 'https://example.com/ferrari-logo.png'),
    ('Lamborghini', 'Italy', 1963, 'Italian luxury sports car manufacturer', 'https://example.com/lamborghini-logo.png'),
    ('Porsche', 'Germany', 1931, 'German performance car brand', 'https://example.com/porsche-logo.png'),
    ('Tesla', 'USA', 2003, 'American electric vehicle manufacturer', 'https://example.com/tesla-logo.png'),
    ('Bugatti', 'France', 1909, 'French hypercar manufacturer', 'https://example.com/bugatti-logo.png'),
    ('McLaren', 'UK', 1985, 'British supercar manufacturer', 'https://example.com/mclaren-logo.png')
ON CONFLICT (name) DO NOTHING;

-- Sample trivia
INSERT INTO trivia_facts (fact, difficulty, category)
VALUES
    ('The first car with an internal combustion engine was built in 1885 by Karl Benz!', 'easy', 'history'),
    ('Ferrari has never built a 4-cylinder car in its history!', 'medium', 'brands'),
    ('The fastest production car in the world is the Bugatti Bolide with a top speed of 330 mph!', 'hard', 'speed'),
    ('Electric vehicles produce zero emissions!', 'easy', 'environment'),
    ('The first traffic light was installed in 1868 in London!', 'medium', 'history')
ON CONFLICT DO NOTHING;
