package com.skillbridge.repository;

import com.skillbridge.entity.WorkRequest;
import com.skillbridge.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WorkRequestRepository extends JpaRepository<WorkRequest, Long> {
    List<WorkRequest> findByWorkerId(Long workerId);
    List<WorkRequest> findByClientId(Long clientId);
    List<WorkRequest> findByWorkerIdAndStatus(Long workerId, RequestStatus status);
    List<WorkRequest> findByClientIdAndStatus(Long clientId, RequestStatus status);
}