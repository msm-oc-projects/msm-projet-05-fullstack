package com.openclassrooms.mddapi.service;

import java.util.List;

import com.openclassrooms.mddapi.dto.TopicResponse;

public interface ITopicService {

	List<TopicResponse> getTopics();

}
