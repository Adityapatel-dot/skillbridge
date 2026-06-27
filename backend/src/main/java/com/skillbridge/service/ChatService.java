package com.skillbridge.service;

import com.skillbridge.dto.ChatMessageRequest;
import com.skillbridge.dto.ChatMessageResponse;
import com.skillbridge.entity.ChatMessage;
import com.skillbridge.entity.Job;
import com.skillbridge.entity.User;
import com.skillbridge.exception.BadRequestException;
import com.skillbridge.exception.ResourceNotFoundException;
import com.skillbridge.repository.ChatMessageRepository;
import com.skillbridge.repository.JobRepository;
import com.skillbridge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;

    @Transactional
    public ChatMessageResponse sendMessage(ChatMessageRequest request) {
        User sender = getCurrentUser();
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found"));

        Job job = null;
        if (request.getJobId() != null) {
            job = jobRepository.findById(request.getJobId())
                    .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

            boolean isParticipant = job.getClient().getId().equals(sender.getId())
                    || (job.getAssignedWorker() != null && job.getAssignedWorker().getId().equals(sender.getId()));
            boolean isReceiverParticipant = job.getClient().getId().equals(receiver.getId())
                    || (job.getAssignedWorker() != null && job.getAssignedWorker().getId().equals(receiver.getId()));

            if (!isParticipant || !isReceiverParticipant) {
                throw new BadRequestException("Both users must be participants of this job");
            }
        }

        ChatMessage message = ChatMessage.builder()
                .sender(sender)
                .receiver(receiver)
                .job(job)
                .content(request.getContent())
                .fileUrl(request.getFileUrl())
                .build();

        message = chatMessageRepository.save(message);
        return mapToResponse(message);
    }

    public List<ChatMessageResponse> getConversation(Long jobId, Long otherUserId) {
        User user = getCurrentUser();
        List<ChatMessage> messages;
        if (jobId != null && jobId > 0) {
            messages = chatMessageRepository.findConversation(jobId, user.getId(), otherUserId);
        } else {
            messages = chatMessageRepository.findConversationBetweenUsers(user.getId(), otherUserId);
        }
        return messages.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ChatMessageResponse> getMyConversations() {
        User user = getCurrentUser();
        return chatMessageRepository.findConversationsByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public long getUnreadCount() {
        User user = getCurrentUser();
        return chatMessageRepository.countByReceiverIdAndReadFalse(user.getId());
    }

    @Transactional
    public void markAsRead(Long jobId, Long otherUserId) {
        User user = getCurrentUser();
        List<ChatMessage> messages;
        if (jobId != null && jobId > 0) {
            messages = chatMessageRepository.findConversation(jobId, user.getId(), otherUserId);
        } else {
            messages = chatMessageRepository.findConversationBetweenUsers(user.getId(), otherUserId);
        }
        messages.stream()
                .filter(m -> !m.isRead() && m.getReceiver().getId().equals(user.getId()))
                .forEach(m -> m.setRead(true));
        chatMessageRepository.saveAll(messages);
    }

    private User getCurrentUser() {
        return userRepository.findByEmail(
                org.springframework.security.core.context.SecurityContextHolder.getContext()
                        .getAuthentication().getName()
        ).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private ChatMessageResponse mapToResponse(ChatMessage message) {
        return ChatMessageResponse.builder()
                .id(message.getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getFullName())
                .receiverId(message.getReceiver().getId())
                .receiverName(message.getReceiver().getFullName())
                .jobId(message.getJob() != null ? message.getJob().getId() : null)
                .jobTitle(message.getJob() != null ? message.getJob().getTitle() : null)
                .content(message.getContent())
                .fileUrl(message.getFileUrl())
                .read(message.isRead())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
