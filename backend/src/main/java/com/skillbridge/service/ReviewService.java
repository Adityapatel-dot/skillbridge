package com.skillbridge.service;

import com.skillbridge.dto.ReviewRequest;
import com.skillbridge.dto.ReviewResponse;
import com.skillbridge.entity.Job;
import com.skillbridge.entity.Review;
import com.skillbridge.entity.User;
import com.skillbridge.enums.JobStatus;
import com.skillbridge.exception.BadRequestException;
import com.skillbridge.exception.ResourceNotFoundException;
import com.skillbridge.repository.JobRepository;
import com.skillbridge.repository.ReviewRepository;
import com.skillbridge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewResponse createReview(ReviewRequest request) {
        User reviewer = getCurrentUser();
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (job.getStatus() != JobStatus.COMPLETED) {
            throw new BadRequestException("Can only review completed jobs");
        }

        boolean isClient = job.getClient().getId().equals(reviewer.getId());
        boolean isWorker = job.getAssignedWorker() != null
                && job.getAssignedWorker().getId().equals(reviewer.getId());

        if (!isClient && !isWorker) {
            throw new BadRequestException("Only the client or assigned worker can review this job");
        }

        if (reviewRepository.existsByJobIdAndReviewerId(job.getId(), reviewer.getId())) {
            throw new BadRequestException("You have already reviewed this job");
        }

        User reviewee = isClient ? job.getAssignedWorker() : job.getClient();
        if (reviewee == null) {
            throw new BadRequestException("No worker assigned to this job");
        }

        Review review = Review.builder()
                .job(job)
                .reviewer(reviewer)
                .reviewee(reviewee)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        review = reviewRepository.save(review);

        updateAverageRating(reviewee.getId());

        return mapToResponse(review);
    }

    public List<ReviewResponse> getReviewsForUser(Long userId) {
        return reviewRepository.findByRevieweeId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Double getAverageRating(Long userId) {
        return reviewRepository.getAverageRatingForUser(userId);
    }

    private void updateAverageRating(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Double avg = reviewRepository.getAverageRatingForUser(userId);
        user.setAverageRating(avg);
        userRepository.save(user);
    }

    private User getCurrentUser() {
        return userRepository.findByEmail(
                org.springframework.security.core.context.SecurityContextHolder.getContext()
                        .getAuthentication().getName()
        ).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .jobId(review.getJob().getId())
                .jobTitle(review.getJob().getTitle())
                .reviewerId(review.getReviewer().getId())
                .reviewerName(review.getReviewer().getFullName())
                .revieweeId(review.getReviewee().getId())
                .revieweeName(review.getReviewee().getFullName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
