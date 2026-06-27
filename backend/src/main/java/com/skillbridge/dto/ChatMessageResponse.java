package com.skillbridge.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageResponse {
    private Long id;
    private Long senderId;
    private String senderName;
    private Long receiverId;
    private String receiverName;
    private Long jobId;
    private String jobTitle;
    private String content;
    private String fileUrl;
    private boolean read;
    private LocalDateTime createdAt;
}
