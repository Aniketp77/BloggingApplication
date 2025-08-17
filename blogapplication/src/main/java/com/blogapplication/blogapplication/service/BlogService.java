package com.blogapplication.blogapplication.service;

import com.blogapplication.blogapplication.exception.BlogNotFoundException;
import com.blogapplication.blogapplication.exception.UnauthorizedException;
import com.blogapplication.blogapplication.model.Blog;
import com.blogapplication.blogapplication.model.BlogDTO;
import com.blogapplication.blogapplication.model.BlogDetailDTO;
import com.blogapplication.blogapplication.model.User;
import com.blogapplication.blogapplication.repo.BlogRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BlogService {
    private final BlogRepository blogRepository;

    public BlogService(BlogRepository blogRepository) {
        this.blogRepository = blogRepository;
    }

//    public Page<Blog> getAllBlogs(Pageable pageable) {
//        return blogRepository.findAllByOrderByCreatedAtDesc(pageable);
//    }


    public Page<BlogDTO> getAllBlogs(Pageable pageable) {
        Page<Blog> blogs = blogRepository.findAll(pageable);
        return blogs.map(this::convertToDto);
    }



    public List<BlogDetailDTO> getBlogsByUser(Long userId) {
        List<Blog> blogs = blogRepository.findByAuthorId(userId);
        return blogs.stream()
                .map(this::convertToDetailDto)
                .collect(Collectors.toList());
    }


    private BlogDTO convertToDto(Blog blog) {
        return new BlogDTO(
                blog.getId(),
                blog.getTitle(),
                blog.getContent(),
                blog.getAuthor().getEmail(), // This triggers proxy initialization
                blog.getCreatedAt(),
                blog.getUpdatedAt()
        );
    }








//    public Blog getBlogById(Long id) {
//        return blogRepository.findById(id).orElse(null);
//    }




    public BlogDetailDTO getBlogById(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new BlogNotFoundException("Blog not found with id: " + id));
        return convertToDetailDto(blog);
    }

    private BlogDetailDTO convertToDetailDto(Blog blog) {
        return new BlogDetailDTO(
                blog.getId(),
                blog.getTitle(),
                blog.getContent(),
                new BlogDetailDTO.AuthorDTO(
                        blog.getAuthor().getId(),
                        blog.getAuthor().getEmail()
                ),
                blog.getCreatedAt(),
                blog.getUpdatedAt()
        );
    }





    public Blog createBlog(Blog blog, User author) {
        blog.setAuthor(author);
        return blogRepository.save(blog);
    }

    public Blog updateBlog(Long id, Blog updatedBlog, User currentUser) {
        Blog existingBlog = blogRepository.findById(id).orElse(null);

        if (existingBlog == null) {
            return null;
        }

        if (!existingBlog.getAuthor().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to update this blog");
        }

        existingBlog.setTitle(updatedBlog.getTitle());
        existingBlog.setContent(updatedBlog.getContent());
        existingBlog.setUpdatedAt(new Date());

        return blogRepository.save(existingBlog);
    }

    public boolean deleteBlog(Long id, User currentUser) {
        Blog blog = blogRepository.findById(id).orElse(null);

        if (blog == null) {
            return false;
        }

        if (!blog.getAuthor().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to delete this blog");
        }

        blogRepository.delete(blog);
        return true;
    }

}
