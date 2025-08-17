package com.blogapplication.blogapplication.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class BlogNotFoundException extends RuntimeException {

    public BlogNotFoundException() {
        super("Blog not found");
    }

    public BlogNotFoundException(String message) {
        super(message);
    }

    public BlogNotFoundException(Long id) {
        super("Blog not found with id: " + id);
    }

    public BlogNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}

