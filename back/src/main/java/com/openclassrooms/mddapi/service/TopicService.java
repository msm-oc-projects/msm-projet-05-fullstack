package com.openclassrooms.mddapi.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import com.openclassrooms.mddapi.dto.TopicResponse;
import com.openclassrooms.mddapi.repository.TopicRepository;
import com.openclassrooms.mddapi.repository.SubscriptionRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import com.openclassrooms.mddapi.model.Subscription;
import com.openclassrooms.mddapi.model.SubscriptionId;

@Service
public class TopicService {

	private final TopicRepository topicRepository;
	private final SubscriptionRepository subscriptionRepository;
	private final UserRepository userRepository;
	
	public TopicService(TopicRepository topicRepository, SubscriptionRepository subscriptionRepository,
			UserRepository userRepository) {
		this.topicRepository = topicRepository;
		this.subscriptionRepository = subscriptionRepository;
		this.userRepository = userRepository;
	}

	@Transactional(readOnly = true)
	public List<TopicResponse> getTopics(Long userId) {
		var subscribedIds = subscriptionRepository.findByUserIdOrderByTopicNameAsc(userId).stream()
				.map(subscription -> subscription.getTopic().getId())
				.collect(java.util.stream.Collectors.toSet());
		return topicRepository.findAllByOrderByNameAsc().stream()
				.map(topic -> TopicResponse.from(topic, subscribedIds.contains(topic.getId())))
				.toList();
	}

	@Transactional
	public void subscribe(Long userId, Long topicId) {
		if (subscriptionRepository.existsByUserIdAndTopicId(userId, topicId)) {
			return;
		}
		var user = userRepository.findById(userId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));
		var topic = topicRepository.findById(topicId)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Thème introuvable"));
		var subscription = new Subscription();
		subscription.setId(new SubscriptionId(userId, topicId));
		subscription.setUser(user);
		subscription.setTopic(topic);
		subscriptionRepository.save(subscription);
	}

	@Transactional
	public void unsubscribe(Long userId, Long topicId) {
		subscriptionRepository.deleteById(new SubscriptionId(userId, topicId));
	}
	
}
