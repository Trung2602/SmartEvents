package com.aws.repositories;

import com.aws.pojo.ChatHistory;
import com.aws.pojo.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatHistoryRepository extends JpaRepository<ChatHistory, UUID> {

    Page<ChatHistory> findByUser(User user, Pageable pageable);

    Page<ChatHistory> findByUserUuid(UUID userUuid, Pageable pageable);

    Page<ChatHistory> findBySessionId(UUID sessionId, Pageable pageable);

    Page<ChatHistory> findByMessageContainingIgnoreCase(String text, Pageable pageable);

    Page<ChatHistory> findByAiResponseContainingIgnoreCase(String text, Pageable pageable);

    Page<ChatHistory> findByModelUsed(String model, Pageable pageable);

    boolean existsByUserUuidAndSessionId(UUID userUuid, UUID sessionId);

    long deleteBySessionId(UUID sessionId);

    long countByUserUuid(UUID userUuid);
}
