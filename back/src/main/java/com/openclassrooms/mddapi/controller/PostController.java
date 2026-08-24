package com.openclassrooms.mddapi.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.config.CurrentUser;
import com.openclassrooms.mddapi.dto.PostDtos.CommentResponse;
import com.openclassrooms.mddapi.dto.PostDtos.CreateCommentRequest;
import com.openclassrooms.mddapi.dto.PostDtos.CreatePostRequest;
import com.openclassrooms.mddapi.dto.PostDtos.PostDetail;
import com.openclassrooms.mddapi.dto.PostDtos.PostSummary;
import com.openclassrooms.mddapi.service.PostService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/articles")
/** Handles the article feed, article creation and comments. */
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    /** Returns the authenticated user's subscribed feed. */
    public List<PostSummary> feed(@RequestParam(defaultValue = "desc") String sort, Authentication authentication) {
        return postService.feed(CurrentUser.id(authentication), sort);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    /** Creates an article for the authenticated user. */
    public PostSummary create(@Valid @RequestBody CreatePostRequest request, Authentication authentication) {
        return postService.create(CurrentUser.id(authentication), request);
    }

    @GetMapping("/{id}")
    /** Returns an article and its comments. */
    public PostDetail detail(@PathVariable Long id, Authentication authentication) {
        return postService.detail(CurrentUser.id(authentication), id);
    }

    @PostMapping("/{id}/comments")
    @ResponseStatus(HttpStatus.CREATED)
    /** Adds a comment to an article for the authenticated user. */
    public CommentResponse comment(@PathVariable Long id, @Valid @RequestBody CreateCommentRequest request,
            Authentication authentication) {
        return postService.comment(CurrentUser.id(authentication), id, request);
    }
}
