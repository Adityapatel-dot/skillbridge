package com.skillbridge.repository;

import com.skillbridge.entity.Job;
import com.skillbridge.enums.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByClientId(Long clientId);
    List<Job> findByStatus(JobStatus status);
    List<Job> findByAssignedWorkerId(Long workerId);

    @Query("SELECT j FROM Job j WHERE j.client.id = :clientId AND j.title = :title")
    java.util.Optional<Job> findByClientIdAndTitle(@Param("clientId") Long clientId, @Param("title") String title);

    @Query("SELECT j FROM Job j WHERE j.status = 'OPEN' ORDER BY j.createdAt DESC")
    List<Job> findAllOpenJobs();

    @Query("SELECT DISTINCT j FROM Job j JOIN j.requiredSkills s WHERE s.name IN :skills AND j.status = 'OPEN'")
    List<Job> findOpenJobsBySkills(@Param("skills") List<String> skills);

    @Query("SELECT j FROM Job j WHERE j.status = 'OPEN' AND j.latitude IS NOT NULL AND j.longitude IS NOT NULL AND " +
           "(6371 * acos(cos(radians(:lat)) * cos(radians(j.latitude)) * cos(radians(j.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(j.latitude)))) <= :radius")
    List<Job> findNearbyOpenJobs(@Param("lat") Double lat, @Param("lng") Double lng, @Param("radius") Double radius);
}