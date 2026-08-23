package com.carsapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf()
          .disable()
        .authorizeHttpRequests((authz) -> authz
            .requestMatchers("/api/auth/**").permitAll()
            .requestMatchers("/api/cars/**").permitAll()
            .requestMatchers("/api/trivia/**").permitAll()
            .requestMatchers("/api/quizzes/**").permitAll()
            .requestMatchers("/actuator/**").permitAll()
            .anyRequest().authenticated()
        )
        .httpBasic()
          .disable()
        .formLogin()
          .disable()
        .logout()
          .disable();

    return http.build();
  }
}
