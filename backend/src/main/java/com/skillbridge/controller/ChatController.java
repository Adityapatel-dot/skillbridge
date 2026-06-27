package com.skillbridge.controller;

import com.skillbridge.dto.ChatMessageRequest;
import com.skillbridge.dto.ChatMessageResponse;
import com.skillbridge.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping("/send")
    public ResponseEntity<ChatMessageResponse> sendMessage(@Valid @RequestBody ChatMessageRequest request) {
        ChatMessageResponse response = chatService.sendMessage(request);
        messagingTemplate.convertAndSendToUser(
                String.valueOf(request.getReceiverId()),
                "/queue/messages",
                response
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/conversation/{jobId}/{otherUserId}")
    public ResponseEntity<List<ChatMessageResponse>> getConversation(
            @PathVariable Long jobId, @PathVariable Long otherUserId) {
        return ResponseEntity.ok(chatService.getConversation(jobId, otherUserId));
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ChatMessageResponse>> getMyConversations() {
        return ResponseEntity.ok(chatService.getMyConversations());
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        return ResponseEntity.ok(Map.of("count", chatService.getUnreadCount()));
    }

    @PutMapping("/read/{jobId}/{otherUserId}")
    public ResponseEntity<Void> markAsRead(@PathVariable Long jobId, @PathVariable Long otherUserId) {
        chatService.markAsRead(jobId, otherUserId);
        return ResponseEntity.noContent().build();
    }
}
