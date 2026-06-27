package com.skillbridge.repository;

import com.skillbridge.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByJobIdOrderByCreatedAtAsc(Long jobId);

    @Query("SELECT m FROM ChatMessage m WHERE (m.sender.id = :userId OR m.receiver.id = :userId) ORDER BY m.createdAt DESC")
    List<ChatMessage> findConversationsByUserId(@Param("userId") Long userId);

    long countByReceiverIdAndReadFalse(Long receiverId);

    @Query("SELECT m FROM ChatMessage m WHERE m.job.id = :jobId AND ((m.sender.id = :userId AND m.receiver.id = :otherId) OR (m.sender.id = :otherId AND m.receiver.id = :userId)) ORDER BY m.createdAt ASC")
    List<ChatMessage> findConversation(@Param("jobId") Long jobId, @Param("userId") Long userId, @Param("otherId") Long otherId);

    @Query("SELECT m FROM ChatMessage m WHERE ((m.sender.id = :userId AND m.receiver.id = :otherId) OR (m.sender.id = :otherId AND m.receiver.id = :userId)) ORDER BY m.createdAt ASC")
    List<ChatMessage> findConversationBetweenUsers(@Param("userId") Long userId, @Param("otherId") Long otherId);
}
