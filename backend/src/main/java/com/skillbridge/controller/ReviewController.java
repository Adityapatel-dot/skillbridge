package com.skillbridge.controller;

import com.skillbridge.dto.ReviewRequest;
import com.skillbridge.dto.ReviewResponse;
import com.skillbridge.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(@Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.createReview(request));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reviewService.getReviewsForUser(userId));
    }

    @GetMapping("/user/{userId}/average")
    public ResponseEntity<Map<String, Object>> getAverageRating(@PathVariable Long userId) {
        Double avg = reviewService.getAverageRating(userId);
        return ResponseEntity.ok(Map.of("averageRating", avg));
    }
}
