package com.carsapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class CarsAppApplication {

  public static void main(String[] args) {
    SpringApplication.run(CarsAppApplication.class, args);
  }

  @Configuration
  public static class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
      registry.addMapping("/**")
              .allowedOrigins("http://localhost:3000", "http://localhost:8080", "http://127.0.0.1:3000", "http://127.0.0.1:8080")
              .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
              .allowedHeaders("*")
              .allowCredentials(true)
              .maxAge(3600);
    }
  }
}
