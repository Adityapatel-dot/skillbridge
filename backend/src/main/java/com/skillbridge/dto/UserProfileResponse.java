package com.skillbridge.dto;

import com.skillbridge.enums.Role;
import lombok.*;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String bio;
    private String experience;
    private Role role;
    private Set<String> skills;
    private Double averageRating;
    private LocalDateTime createdAt;
    private Double latitude;
    private Double longitude;
    private String address;
}