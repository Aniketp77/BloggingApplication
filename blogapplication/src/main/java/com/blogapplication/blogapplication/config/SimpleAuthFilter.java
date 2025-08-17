package com.blogapplication.blogapplication.config;

import com.blogapplication.blogapplication.model.User;
import com.blogapplication.blogapplication.repo.UserRepository;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Base64;

@Component
public class SimpleAuthFilter implements Filter {
    private final UserRepository userRepository;

    public SimpleAuthFilter(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Skip authentication for public endpoints
        if (isPublicEndpoint(httpRequest)) {
            chain.doFilter(request, response);
            return;
        }

        String authHeader = httpRequest.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Basic ")) {
            httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authorization header is missing");
            return;
        }

        String credentials = new String(Base64.getDecoder().decode(authHeader.substring(6)));
        String[] parts = credentials.split(":", 2);
        if (parts.length != 2) {
            httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid authorization header");
            return;
        }

        String email = parts[0];
        String password = parts[1];

        User user = userRepository.findByEmail(email);
        if (user == null || !user.getPassword().equals(password)) {
            httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid credentials");
            return;
        }

        // Add user to request attributes for controllers to use
        request.setAttribute("currentUser", user);
        chain.doFilter(request, response);
    }

    private boolean isPublicEndpoint(HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();

        // Public endpoints
        if (path.equals("/api/auth/register") && method.equals("POST")) {
            return true;
        }
        if (path.equals("/api/auth/login") && method.equals("POST")) {
            return true;
        }
        // Public GET endpoints for blogs
        if (method.equals("GET") && path.startsWith("/api/blogs")) {
            return true;
        }

        return false;
    }
}
