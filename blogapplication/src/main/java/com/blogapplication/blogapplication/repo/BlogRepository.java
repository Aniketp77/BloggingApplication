package com.blogapplication.blogapplication.repo;


import com.blogapplication.blogapplication.model.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlogRepository extends JpaRepository<Blog, Long> {
    Page<Blog> findAllByOrderByCreatedAtDesc(Pageable pageable);

    List<Blog> findByAuthorId(Long authorId);

}