package com.skillbridge.repository;

import com.skillbridge.entity.JobApplication;
import com.skillbridge.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByJobId(Long jobId);
    List<JobApplication> findByWorkerId(Long workerId);
    Optional<JobApplication> findByJobIdAndWorkerId(Long jobId, Long workerId);
    boolean existsByJobIdAndWorkerId(Long jobId, Long workerId);
    List<JobApplication> findByJobIdAndStatus(Long jobId, ApplicationStatus status);

    @Query("SELECT a FROM JobApplication a WHERE a.job.client.id = :clientId")
    List<JobApplication> findByJobClientId(@Param("clientId") Long clientId);
}