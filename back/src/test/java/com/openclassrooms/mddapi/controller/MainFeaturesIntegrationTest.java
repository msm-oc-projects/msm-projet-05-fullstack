package com.openclassrooms.mddapi.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest(properties = "app.jwt.secret=MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=")
@AutoConfigureMockMvc
class MainFeaturesIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldCompleteAuthenticatedMainUserJourney() throws Exception {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        String username = "dev" + suffix;
        String email = username + "@example.com";

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"invalid@example.com\",\"username\":\"invalid\",\"password\":\"weak\"}"))
                .andExpect(status().isBadRequest());
        mockMvc.perform(get("/api/topics")).andExpect(status().isUnauthorized());

        String authJson = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"%s","username":"%s","password":"Valid1!password"}
                                """.formatted(email, username)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andReturn().getResponse().getContentAsString();
        String token = objectMapper.readTree(authJson).get("token").asText();

        String topicsJson = mockMvc.perform(get("/api/topics").header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].subscribed").value(false))
                .andReturn().getResponse().getContentAsString();
        Long topicId = objectMapper.readTree(topicsJson).get(0).get("id").asLong();

        mockMvc.perform(post("/api/topics/{id}/subscription", topicId).header("Authorization", bearer(token)))
                .andExpect(status().isNoContent());

        String postJson = mockMvc.perform(post("/api/articles")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"topicId":%d,"title":"Architecture Angular","content":"Contenu de validation"}
                                """.formatted(topicId)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.author").value(username))
                .andReturn().getResponse().getContentAsString();
        Long postId = objectMapper.readTree(postJson).get("id").asLong();

        mockMvc.perform(post("/api/articles")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"topicId\":%d,\"title\":\"\",\"content\":\"\"}".formatted(topicId)))
                .andExpect(status().isBadRequest());

        String secondPostJson = mockMvc.perform(post("/api/articles")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"topicId":%d,"title":"Deuxième article","content":"Contenu plus récent"}
                                """.formatted(topicId)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        Long secondPostId = objectMapper.readTree(secondPostJson).get("id").asLong();

        String descendingFeed = mockMvc.perform(get("/api/articles?sort=desc").header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        String ascendingFeed = mockMvc.perform(get("/api/articles?sort=asc").header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        assertTrue(indexOf(descendingFeed, secondPostId) < indexOf(descendingFeed, postId));
        assertTrue(indexOf(ascendingFeed, postId) < indexOf(ascendingFeed, secondPostId));

        mockMvc.perform(post("/api/articles/{id}/comments", postId)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"content\":\"   \"}"))
                .andExpect(status().isBadRequest());

        mockMvc.perform(post("/api/articles/{id}/comments", postId)
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"content\":\"Commentaire de validation\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.author").value(username));

        mockMvc.perform(get("/api/articles/{id}", postId).header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.comments[0].content").value("Commentaire de validation"));

        mockMvc.perform(put("/api/me")
                        .header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"%s","username":"%s"}
                                """.formatted(email, username + "updated")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.subscriptions[0].id").value(topicId));

        mockMvc.perform(delete("/api/topics/{id}/subscription", topicId).header("Authorization", bearer(token)))
                .andExpect(status().isNoContent());
    }

    private String bearer(String token) {
        return "Bearer " + token;
    }

    private int indexOf(String json, Long postId) throws Exception {
        JsonNode nodes = objectMapper.readTree(json);
        for (int index = 0; index < nodes.size(); index++) {
            if (nodes.get(index).get("id").asLong() == postId) {
                return index;
            }
        }
        return -1;
    }
}
