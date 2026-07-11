package com.openclassrooms.mddapi.service;

import java.util.List;

import com.openclassrooms.mddapi.dto.TopicResponse;

public interface ITopicService {

	List<TopicResponse> getTopics(Long userId);
	void subscribe(Long userId, Long topicId);
	void unsubscribe(Long userId, Long topicId);

}
