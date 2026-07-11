package com.openclassrooms.mddapi.dto;

import com.openclassrooms.mddapi.model.Topic;

public record TopicResponse(Long id, String name, String description) {

    public static TopicResponse from(Topic topic) {
        return new TopicResponse(topic.getId(), topic.getName(), topic.getDescription());
    }
}
