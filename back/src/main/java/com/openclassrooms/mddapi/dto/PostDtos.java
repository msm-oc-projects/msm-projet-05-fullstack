package com.openclassrooms.mddapi.dto;

import java.time.Instant;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public final class PostDtos {
    private PostDtos() {
    }

    public record CreatePostRequest(@NotNull Long topicId, @NotBlank @Size(max = 255) String title,
            @NotBlank String content) {
    }

    public record CreateCommentRequest(@NotBlank String content) {
    }

    public record CommentResponse(Long id, String content, String author, Instant createdAt) {
    }

    public record PostSummary(Long id, String title, String content, String author, String topic, Instant createdAt) {
    }

    public record PostDetail(Long id, String title, String content, String author, String topic, Instant createdAt,
            List<CommentResponse> comments) {
    }
}
