package com.skillbridge.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageRequest {
    @NotNull(message = "Receiver ID is required")
    private Long receiverId;

    private Long jobId;

    @NotBlank(message = "Message content is required")
    @Size(max = 2000)
    private String content;

    private String fileUrl;
}
