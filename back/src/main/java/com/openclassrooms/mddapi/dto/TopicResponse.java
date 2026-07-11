package com.openclassrooms.mddapi.dto;

import com.openclassrooms.mddapi.model.Topic;

public record TopicResponse(Long id, String name, String description, boolean subscribed) {

    public static TopicResponse from(Topic topic) {
        return from(topic, false);
    }

    public static TopicResponse from(Topic topic, boolean subscribed) {
        return new TopicResponse(topic.getId(), topic.getName(), topic.getDescription(), subscribed);
    }
}
