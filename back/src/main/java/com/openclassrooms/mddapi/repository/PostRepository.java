package com.openclassrooms.mddapi.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.EntityGraph;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.openclassrooms.mddapi.model.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Long>{
	@EntityGraph(attributePaths = {"topic", "author"})
	List<Post> findByTopicIdIn(List<Long> topicIds, Sort sort);

	@EntityGraph(attributePaths = {"topic", "author"})
	Optional<Post> findWithTopicAndAuthorById(Long id);

}
