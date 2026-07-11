package com.openclassrooms.mddapi.service;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.openclassrooms.mddapi.dto.PostDtos.CommentResponse;
import com.openclassrooms.mddapi.dto.PostDtos.CreateCommentRequest;
import com.openclassrooms.mddapi.dto.PostDtos.CreatePostRequest;
import com.openclassrooms.mddapi.dto.PostDtos.PostDetail;
import com.openclassrooms.mddapi.dto.PostDtos.PostSummary;
import com.openclassrooms.mddapi.model.Comment;
import com.openclassrooms.mddapi.model.Post;
import com.openclassrooms.mddapi.repository.CommentRepository;
import com.openclassrooms.mddapi.repository.PostRepository;
import com.openclassrooms.mddapi.repository.SubscriptionRepository;
import com.openclassrooms.mddapi.repository.TopicRepository;
import com.openclassrooms.mddapi.repository.UserRepository;

/**
 * Handles the article feed, article publication and comments while keeping
 * authorization-sensitive data access on the server side.
 */
@Service
public class PostService {
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final TopicRepository topicRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository, CommentRepository commentRepository,
            SubscriptionRepository subscriptionRepository, TopicRepository topicRepository,
            UserRepository userRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.topicRepository = topicRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<PostSummary> feed(Long userId, String direction) {
        if (!"asc".equalsIgnoreCase(direction) && !"desc".equalsIgnoreCase(direction)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tri invalide");
        }
        var topicIds = subscriptionRepository.findByUserIdOrderByTopicNameAsc(userId).stream()
                .map(subscription -> subscription.getTopic().getId())
                .toList();
        if (topicIds.isEmpty()) {
            return List.of();
        }
        Sort.Direction sortDirection = "asc".equalsIgnoreCase(direction) ? Sort.Direction.ASC : Sort.Direction.DESC;
        var sort = Sort.by(sortDirection, "createdAt").and(Sort.by(sortDirection, "id"));
        return postRepository.findByTopicIdIn(topicIds, sort).stream()
                .map(this::summary)
                .toList();
    }

    @Transactional
    public PostSummary create(Long userId, CreatePostRequest request) {
        var author = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));
        var topic = topicRepository.findById(request.topicId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Thème introuvable"));
        var post = new Post();
        post.setAuthor(author);
        post.setTopic(topic);
        post.setTitle(request.title().trim());
        post.setContent(request.content().trim());
        return summary(postRepository.save(post));
    }

    @Transactional(readOnly = true)
    public PostDetail detail(Long postId) {
        var post = find(postId);
        var comments = commentRepository.findByPostIdOrderByCreatedAtAsc(postId).stream()
                .map(this::comment)
                .toList();
        return new PostDetail(post.getId(), post.getTitle(), post.getContent(), post.getAuthor().getUsername(),
                post.getTopic().getName(), post.getCreatedAt(), comments);
    }

    @Transactional
    public CommentResponse comment(Long userId, Long postId, CreateCommentRequest request) {
        var post = find(postId);
        var author = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));
        var comment = new Comment();
        comment.setPost(post);
        comment.setAuthor(author);
        comment.setContent(request.content().trim());
        return comment(commentRepository.save(comment));
    }

    private Post find(Long postId) {
        return postRepository.findWithTopicAndAuthorById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article introuvable"));
    }

    private PostSummary summary(Post post) {
        return new PostSummary(post.getId(), post.getTitle(), post.getContent(), post.getAuthor().getUsername(),
                post.getTopic().getName(), post.getCreatedAt());
    }

    private CommentResponse comment(Comment comment) {
        return new CommentResponse(comment.getId(), comment.getContent(), comment.getAuthor().getUsername(),
                comment.getCreatedAt());
    }
}
