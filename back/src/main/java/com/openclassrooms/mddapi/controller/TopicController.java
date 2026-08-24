package com.openclassrooms.mddapi.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;

import com.openclassrooms.mddapi.config.CurrentUser;
import com.openclassrooms.mddapi.dto.TopicResponse;
import com.openclassrooms.mddapi.service.TopicService;

@RestController
@RequestMapping("/api/topics")
/** Exposes topic discovery and subscription operations. */
public class TopicController {
	
	private final TopicService topicService;
	
	public TopicController(TopicService topicService) {
		this.topicService = topicService;		
	}

	@GetMapping
	/** Returns all topics and the authenticated user's subscription state. */
	public List<TopicResponse> getTopics(Authentication authentication) {
		return topicService.getTopics(CurrentUser.id(authentication));
	}

	@PostMapping("/{id}/subscription")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	/** Subscribes the authenticated user to a topic. */
	public void subscribe(@PathVariable Long id, Authentication authentication) {
		topicService.subscribe(CurrentUser.id(authentication), id);
	}

	@DeleteMapping("/{id}/subscription")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	/** Removes a topic subscription for the authenticated user. */
	public void unsubscribe(@PathVariable Long id, Authentication authentication) {
		topicService.unsubscribe(CurrentUser.id(authentication), id);
	}
}
