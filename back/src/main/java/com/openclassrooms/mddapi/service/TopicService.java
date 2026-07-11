package com.openclassrooms.mddapi.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.openclassrooms.mddapi.dto.TopicResponse;
import com.openclassrooms.mddapi.repository.TopicRepository;

@Service
public class TopicService implements ITopicService {

	private final TopicRepository topicRepository;
	
	public TopicService(TopicRepository topicRepository) {
		this.topicRepository = topicRepository;
	}

	@Override
	public List<TopicResponse> getTopics() {
		return topicRepository.findAllByOrderByNameAsc().stream()
				.map(TopicResponse::from)
				.toList();
	}
	
}
