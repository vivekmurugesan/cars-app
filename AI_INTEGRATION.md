# Gemini AI Integration Guide

This document describes the Gemini AI integration for the Cars App backend.

## Overview

The application uses Google's Gemini AI API to generate:
- Educational trivia facts about cars
- Interactive quiz questions
- Car details and specifications
- Featured car recommendations
- Car search results with AI insights

All results are cached in the database to minimize API calls and improve performance.

## Architecture

### Components

1. **GeminiAIService** (`com.carsapp.service.ai.GeminiAIService`)
   - Direct integration with Gemini API
   - Handles HTTP communication with RestTemplate
   - Parses JSON responses from Gemini
   - No caching logic (pure API calls)

2. **AIService** (`com.carsapp.service.AIService`)
   - Orchestrates GeminiAIService with caching layer
   - Implements check-before-call pattern
   - Returns cached results when available
   - Stores new results in database

3. **Database Entities**
   - `CachedTrivia`: Stores generated trivia with media search terms
   - `CachedQuiz`: Stores generated quiz questions and options
   - `CachedCar`: Stores car details fetched via AI
   - `CachedFeaturedCar`: Stores featured car recommendations

4. **Controllers**
   - `AIController`: Direct AI endpoints at `/api/ai/**`
   - `TriviaController`: Enhanced with `/api/trivia/ai/{topic}`
   - `CarController`: Enhanced with `/api/cars/featured/car`, `/api/cars/ai/search`, `/api/cars/ai/details`
   - `QuizController`: Enhanced with `/api/quiz/ai/generate`

## Configuration

### Environment Variables

Set the following environment variables for Gemini API integration:

```bash
# Gemini API Configuration
AI_API_KEY=your-gemini-api-key
AI_MODEL=gemini-pro  # or another available Gemini model
AI_PROVIDER=gemini   # currently only 'gemini' is supported
```

### Application Configuration

In `application.yml`:

```yaml
app:
  ai:
    provider: ${AI_PROVIDER:gemini}
    api-key: ${AI_API_KEY:}
    model: ${AI_MODEL:gemini-pro}
```

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com)
2. Click "Get API Key"
3. Create a new API key in your Google Cloud project
4. Copy the key and set it as `AI_API_KEY` environment variable

## API Endpoints

### Direct AI Endpoints (`/api/ai`)

All endpoints require an `AI_API_KEY` to be configured.

#### Generate Trivia
```
GET /api/ai/trivia?topic=electric-cars
Response: {
  "fact": "...",
  "topic": "electric-cars",
  "difficulty": "medium"
}
```

#### Generate Trivia with Media
```
GET /api/ai/trivia-with-media?topic=tesla
Response: {
  "fact": "...",
  "topic": "tesla",
  "difficulty": "easy|medium|hard",
  "imageSearchTerms": "Tesla Model S...",
  "videoSearchTerms": "Tesla charging..."
}
```

#### Generate Quiz Question
```
GET /api/ai/quiz?topic=supercars&difficulty=hard
Response: {
  "question": "What is the top speed of...",
  "options": ["option1", "option2", "option3", "option4"],
  "correctAnswer": "option1"
}
```

#### Get Car Details
```
GET /api/ai/car-details?carName=Ferrari%20F40
Response: {
  "brand": "Ferrari",
  "model": "F40",
  "year": 1987,
  "topSpeed": 324,
  "horsepower": 478,
  "description": "...",
  "historicalSignificance": "...",
  "funFact": "..."
}
```

#### Get Featured Car
```
GET /api/ai/featured-car
Response: {
  "brand": "...",
  "model": "...",
  "category": "...",
  "description": "...",
  "interestingFact": "...",
  "whyFeatured": "..."
}
```

#### Search Cars
```
GET /api/ai/search-cars?query=fast%20electric%20cars
Response: [
  {
    "brand": "Tesla",
    "model": "Model S Plaid",
    "category": "ELECTRIC_VEHICLE",
    "description": "..."
  },
  ...
]
```

### Enhanced Service Endpoints

#### Trivia with Media (via TriviaController)
```
GET /api/trivia/ai/{topic}
GET /api/trivia/ai/history → Returns trivia with images and videos
```

#### Featured Car (via CarController)
```
GET /api/cars/featured/car
```

#### AI Car Search
```
GET /api/cars/ai/search?query=lamborghini
```

#### AI Car Details
```
GET /api/cars/ai/details?carName=Bugatti%20Veyron
```

#### AI Quiz Generation
```
GET /api/quiz/ai/generate?topic=sports-cars&difficulty=hard
```

## Caching Strategy

### How It Works

1. **First Request**: Service checks cache, finds nothing, calls Gemini API
2. **API Response**: Result is parsed and stored in database
3. **Subsequent Requests**: Returns cached result immediately
4. **Cache Duration**: Results persist until manually cleared (no expiration)

### Cache Tables

Each cache table is indexed by topic/carName for fast lookups:

- `cached_trivia`: Indexed on `topic`
- `cached_quizzes`: Indexed on `topic`, `difficulty`
- `cached_cars`: Indexed on `car_name` (unique)
- `cached_featured_cars`: Indexed on `created_at`

### Cache Invalidation

Currently, cached results persist indefinitely. To clear cache:

```sql
-- Clear all cached trivia
DELETE FROM cached_trivia;

-- Clear all cached quizzes
DELETE FROM cached_quizzes;

-- Clear all cached cars
DELETE FROM cached_cars;

-- Clear all cached featured cars
DELETE FROM cached_featured_cars;
```

## Prompting Strategy

All AI calls include context to ensure responses are:
- Appropriate for kids (10-15 years old)
- Educational and engaging
- Well-structured (JSON format)
- Concise and focused

### Trivia Prompt
- Generates interesting car facts
- Includes fun elements
- Suggests image and video search terms
- Specifies difficulty level

### Quiz Prompt
- Generates multiple-choice questions (4 options)
- Includes correct answer
- Age-appropriate content
- Specified difficulty level

### Car Details Prompt
- Retrieves brand, model, year, specs
- Includes historical significance
- Adds fun facts
- Structured JSON format

### Featured Car Prompt
- Selects iconic cars
- Explains why featured
- Includes interesting facts
- Multiple paragraphs of description

## Error Handling

### Common Issues

1. **API Key Not Configured**
   - Error: `Gemini API key not configured`
   - Solution: Set `AI_API_KEY` environment variable

2. **Invalid JSON Response**
   - Error: `Failed to parse quiz JSON response`
   - Solution: Check Gemini API status; may need retry

3. **Network/Timeout Issues**
   - Error: `Error calling Gemini API`
   - Solution: Check internet connection; Gemini API may be temporarily unavailable

### Logging

All AI operations are logged at `DEBUG` level:
```
com.carsapp.service.ai=DEBUG
com.carsapp.service.AIService=DEBUG
```

Check logs for:
- API call details
- Response parsing
- Cache hits/misses
- Error messages

## Performance Considerations

### Cache Benefits

1. **Reduced API Calls**: Frequently accessed content served from database
2. **Faster Response Times**: No network latency for cached results
3. **Cost Savings**: Fewer API calls = lower token usage

### Benchmarks

- First request (uncached): ~1-3 seconds
- Subsequent requests (cached): <100ms

### Future Enhancements

- Add TTL (Time-To-Live) for cache expiration
- Implement cache warming strategies
- Add cache statistics/monitoring
- Support multiple AI providers

## Testing

### Manual Testing

1. Start backend with Gemini API key configured
2. Test endpoints using curl or Postman
3. Verify database records are created
4. Clear cache and test again
5. Verify same results are returned from cache

### Integration Tests

```bash
# Test trivia generation
curl "http://localhost:8080/api/trivia/ai/electric-cars"

# Test featured car
curl "http://localhost:8080/api/cars/featured/car"

# Test AI quiz
curl "http://localhost:8080/api/quiz/ai/generate?topic=supercars"
```

## Troubleshooting

### No API Key Error
Check that `AI_API_KEY` is set in environment:
```bash
echo $AI_API_KEY
```

### Invalid JSON Error
Ensure Gemini API is responding correctly by checking:
1. API key is valid
2. Network connectivity
3. Gemini API status page

### Cache Not Working
1. Verify database tables exist
2. Check `cached_*` tables have data
3. Verify indexes are created

### Performance Issues
1. Check database indexes
2. Monitor API call frequency
3. Review cache hit rates
4. Consider cache cleanup if too large

## Dependencies

- **RestTemplate**: Spring's HTTP client for API calls
- **ObjectMapper**: Jackson for JSON parsing
- **JPA/Hibernate**: Database ORM for caching
- **PostgreSQL**: Cache storage backend

## References

- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Spring RestTemplate Guide](https://spring.io/guides/gs/consuming-rest/)
- [Jackson JSON Processing](https://github.com/FasterXML/jackson)
