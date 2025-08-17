package com.blogapplication.blogapplication;

import com.blogapplication.blogapplication.config.SimpleAuthFilter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.core.Ordered;

@SpringBootApplication
public class BlogapplicationApplication {

	public static void main(String[] args) {
		SpringApplication.run(BlogapplicationApplication.class, args);
	}


//	@Bean
//	public FilterRegistrationBean<SimpleAuthFilter> simpleAuthFilterRegistration(SimpleAuthFilter filter) {
//		FilterRegistrationBean<SimpleAuthFilter> registration = new FilterRegistrationBean<>(filter);
//		registration.addUrlPatterns("/api/*");
//		registration.setOrder(Ordered.LOWEST_PRECEDENCE - 1); // Make sure it runs after CORS filter
//		return registration;
//	}

}
