package com.carsapp.service.ai;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import jakarta.annotation.PostConstruct;

@Service
@Slf4j
@RequiredArgsConstructor
public class GeminiAIService {

    @Value("${app.ai.api-key:}")
    private String apiKey;

    @Value("${app.ai.model:gemini-pro-vision}")
    private String model;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent";
    private static final String GEMINI_MODELS_URL = "https://generativelanguage.googleapis.com/v1beta/models";

    @PostConstruct
    public void init() {
        if (apiKey != null && !apiKey.isEmpty()) {
            log.info("Gemini API configured with model: {}", model);
            listAvailableModels();
        }
    }

    /**
     * Generate trivia content using Gemini API
     */
    public String generateTrivia(String topic) {
        if (apiKey == null || apiKey.isEmpty()) {
            log.warn("Gemini API key not configured");
            return null;
        }

        String prompt = String.format(
            "Generate an interesting and educational car trivia fact about '%s'. " +
            "Make it engaging for kids (10-15 years old). " +
            "Keep it concise (under 100 words). " +
            "Include a fun fact or surprising element.",
            topic
        );

        return callGeminiAPI(prompt);
    }

    /**
     * Generate quiz content using Gemini API
     */
    public Map<String, Object> generateQuizQuestion(String topic, String difficulty) {
        if (apiKey == null || apiKey.isEmpty()) {
            log.warn("Gemini API key not configured");
            return null;
        }

        String prompt = String.format(
            "Generate a multiple-choice quiz question about cars for '%s' topic with '%s' difficulty. " +
            "Format the response as JSON with the following structure: " +
            "{ \"question\": \"...\", \"options\": [\"option1\", \"option2\", \"option3\", \"option4\"], \"correctAnswer\": \"option1\" } " +
            "Make it educational and engaging for kids.",
            topic, difficulty
        );

        String response = callGeminiAPI(prompt);
        if (response != null) {
            try {
                return objectMapper.readValue(response, Map.class);
            } catch (Exception e) {
                log.error("Failed to parse quiz JSON response", e);
            }
        }
        return null;
    }

    /**
     * Get car details using Gemini API
     */
    public Map<String, Object> getCarDetails(String carName) {
        if (apiKey == null || apiKey.isEmpty()) {
            log.warn("Gemini API key not configured");
            return null;
        }

        String prompt = String.format(
            "Provide detailed information about the %s car. " +
            "Format as JSON with: { \"brand\": \"\", \"model\": \"\", \"year\": 0, \"topSpeed\": 0, " +
            "\"horsepower\": 0, \"description\": \"\", \"historicalSignificance\": \"\", \"funFact\": \"\" } " +
            "Keep descriptions concise and engaging for kids.",
            carName
        );

        String response = callGeminiAPI(prompt);
        if (response != null) {
            try {
                return objectMapper.readValue(response, Map.class);
            } catch (Exception e) {
                log.error("Failed to parse car details JSON response", e);
            }
        }
        return null;
    }

    /**
     * Search for cars using Gemini API
     */
    public List<Map<String, Object>> searchCars(String query) {
        if (apiKey == null || apiKey.isEmpty()) {
            log.warn("Gemini API key not configured");
            return null;
        }

        String prompt = String.format(
            "Search for cars matching the query '%s'. " +
            "Return a JSON array with up to 5 results in this format: " +
            "[{ \"brand\": \"\", \"model\": \"\", \"category\": \"\", \"description\": \"\" }, ...] " +
            "Focus on popular and interesting cars for kids.",
            query
        );

        String response = callGeminiAPI(prompt);
        if (response != null) {
            try {
                return objectMapper.readValue(response, List.class);
            } catch (Exception e) {
                log.error("Failed to parse search results JSON response", e);
            }
        }
        return null;
    }

    /**
     * Generate featured car content
     */
    public Map<String, Object> generateFeaturedCar() {
        if (apiKey == null || apiKey.isEmpty()) {
            log.warn("Gemini API key not configured");
            return null;
        }

        String prompt = "Generate a featured car for kids. " +
            "Format as JSON with: { \"brand\": \"\", \"model\": \"\", \"category\": \"\", " +
            "\"description\": \"\", \"interestingFact\": \"\", \"whyFeatured\": \"\" } " +
            "Pick a car that's interesting and iconic.";

        String response = callGeminiAPI(prompt);
        if (response != null) {
            try {
                return objectMapper.readValue(response, Map.class);
            } catch (Exception e) {
                log.error("Failed to parse featured car JSON response", e);
            }
        }
        return null;
    }

    /**
     * Generate trivia with media suggestions (images, videos)
     */
    public Map<String, Object> generateTriviaWithMedia(String topic) {
        if (apiKey == null || apiKey.isEmpty()) {
            log.warn("Gemini API key not configured");
            return null;
        }

        String prompt = String.format(
            "Generate a trivia about '%s' with media suggestions. " +
            "Format as JSON: { \"fact\": \"\", \"imageSearch\": \"search terms\", \"videoSearch\": \"search terms\", " +
            "\"difficulty\": \"easy/medium/hard\" } " +
            "Suggest search terms for relevant images and educational videos.",
            topic
        );

        String response = callGeminiAPI(prompt);
        if (response != null) {
            try {
                return objectMapper.readValue(response, Map.class);
            } catch (Exception e) {
                log.error("Failed to parse trivia with media JSON response", e);
            }
        }
        return null;
    }

    /**
     * Internal method to call Gemini API
     */
    private String callGeminiAPI(String prompt) {
        try {
            String url = GEMINI_API_URL.replace("{model}", model) + "?key=" + apiKey;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> content = new HashMap<>();
            Map<String, String> part = new HashMap<>();

            part.put("text", prompt);
            content.put("parts", new Object[]{part});
            requestBody.put("contents", new Object[]{content});

            HttpEntity<String> entity = new HttpEntity<>(
                objectMapper.writeValueAsString(requestBody),
                headers
            );

            var response = restTemplate.postForEntity(url, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                if (root.has("candidates") && root.get("candidates").isArray() && root.get("candidates").size() > 0) {
                    JsonNode candidate = root.get("candidates").get(0);
                    if (candidate.has("content") && candidate.get("content").has("parts")) {
                        JsonNode parts = candidate.get("content").get("parts");
                        if (parts.isArray() && parts.size() > 0) {
                            return parts.get(0).get("text").asText();
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error calling Gemini API with model '{}': {}", model, e.getMessage());
            if (e.getMessage() != null && e.getMessage().contains("404")) {
                log.error("Model '{}' not found or does not support generateContent. Printing available models now:", model);
                listAvailableModels();
            }
        }
        return null;
    }

    /**
     * Check if API is configured
     */
    public boolean isConfigured() {
        return apiKey != null && !apiKey.isEmpty();
    }

    /**
     * List available Gemini models
     */
    public void listAvailableModels() {
        try {
            String url = GEMINI_MODELS_URL + "?key=" + apiKey;
            var response = restTemplate.getForEntity(url, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                if (root.has("models") && root.get("models").isArray()) {
                    log.info("=== Available Gemini Models (key: ...{}) ===",
                        apiKey.length() > 4 ? apiKey.substring(apiKey.length() - 4) : "****");
                    for (JsonNode modelNode : root.get("models")) {
                        String modelName = modelNode.get("name").asText();
                        String displayName = modelNode.has("displayName") ? modelNode.get("displayName").asText() : "";
                        boolean supportsGenerateContent = false;
                        StringBuilder methods = new StringBuilder();
                        if (modelNode.has("supportedGenerationMethods")) {
                            for (JsonNode m : modelNode.get("supportedGenerationMethods")) {
                                String methodName = m.asText();
                                methods.append(methodName).append(", ");
                                if ("generateContent".equals(methodName)) {
                                    supportsGenerateContent = true;
                                }
                            }
                        }
                        if (supportsGenerateContent) {
                            log.info(">>> USABLE: {} ({}) - methods: [{}]", modelName, displayName, methods);
                        } else {
                            log.info("    skip:   {} ({}) - methods: [{}]", modelName, displayName, methods);
                        }
                    }
                    log.info("=== Set AI_MODEL to one of the '>>> USABLE' names above (without the 'models/' prefix) ===");
                }
            } else {
                log.warn("ListModels call returned status {}", response.getStatusCode());
            }
        } catch (Exception e) {
            log.warn("Failed to list available Gemini models: {}", e.getMessage());
        }
    }
}
