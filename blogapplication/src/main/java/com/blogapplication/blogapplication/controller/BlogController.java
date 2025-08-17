package com.blogapplication.blogapplication.controller;


import com.blogapplication.blogapplication.model.Blog;
import com.blogapplication.blogapplication.model.BlogDTO;
import com.blogapplication.blogapplication.model.BlogDetailDTO;
import com.blogapplication.blogapplication.model.User;
import com.blogapplication.blogapplication.service.BlogService;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blogs")
//@CrossOrigin(origins = "http://localhost:5173")
public class BlogController {
    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

//    @GetMapping
//    public ResponseEntity<Page<Blog>> getAllBlogs(Pageable pageable) {
//        return ResponseEntity.ok(blogService.getAllBlogs(pageable));
//    }


    @GetMapping
    public ResponseEntity<Page<BlogDTO>> getAllBlogs(Pageable pageable) {
        return ResponseEntity.ok(blogService.getAllBlogs(pageable));
    }

//    @GetMapping("/{id}")
//    public ResponseEntity<Blog> getBlogById(@PathVariable Long id) {
//        Blog blog = blogService.getBlogById(id);
//        if (blog == null) {
//            return ResponseEntity.notFound().build();
//        }
//        return ResponseEntity.ok(blog);
//    }



    @GetMapping("/{id}")
    public ResponseEntity<BlogDetailDTO> getBlogById(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.getBlogById(id));
    }






    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BlogDetailDTO>> getBlogsByUser(@PathVariable Long userId) {
        List<BlogDetailDTO> blogs = blogService.getBlogsByUser(userId);
        return ResponseEntity.ok(blogs);
    }







    @PostMapping
    @Transactional
    public ResponseEntity<Blog> createBlog(@RequestBody Blog blog, @RequestAttribute User currentUser) {
        return ResponseEntity.ok(blogService.createBlog(blog, currentUser));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Blog> updateBlog(
            @PathVariable Long id,
            @RequestBody Blog updatedBlog,
            @RequestAttribute User currentUser) {
        Blog blog = blogService.updateBlog(id, updatedBlog, currentUser);
        if (blog == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(blog);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id, @RequestAttribute User currentUser) {
        boolean deleted = blogService.deleteBlog(id, currentUser);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

}