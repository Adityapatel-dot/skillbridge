package com.skillbridge.service;

import com.skillbridge.dto.ProfileUpdateRequest;
import com.skillbridge.dto.UserProfileResponse;
import com.skillbridge.entity.Skill;
import com.skillbridge.entity.User;
import com.skillbridge.enums.Role;
import com.skillbridge.exception.ResourceNotFoundException;
import com.skillbridge.repository.SkillRepository;
import com.skillbridge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;

    public User getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new ResourceNotFoundException("User not authenticated");
        }
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
    }

    public UserProfileResponse getProfile(Long userId) {
        User user = getUserById(userId);
        return mapToProfileResponse(user);
    }

    public UserProfileResponse getMyProfile() {
        User user = getCurrentUser();
        return mapToProfileResponse(user);
    }

    @Transactional
    public UserProfileResponse updateProfile(ProfileUpdateRequest request) {
        User user = getCurrentUser();

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getExperience() != null) {
            user.setExperience(request.getExperience());
        }
        if (request.getLatitude() != null) user.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) user.setLongitude(request.getLongitude());
        if (request.getAddress() != null) user.setAddress(request.getAddress());

        if (request.getSkillNames() != null && !request.getSkillNames().isEmpty()) {
            Set<Skill> skills = new HashSet<>();
            for (String skillName : request.getSkillNames()) {
                Skill skill = skillRepository.findByNameIgnoreCase(skillName.trim())
                        .orElseGet(() -> {
                            Skill newSkill = Skill.builder()
                                    .name(skillName.trim())
                                    .category("General")
                                    .build();
                            return skillRepository.save(newSkill);
                        });
                skills.add(skill);
            }
            user.setSkills(skills);
        }

        userRepository.save(user);
        return mapToProfileResponse(user);
    }

    public List<UserProfileResponse> getAllWorkers() {
        return userRepository.findByRole(Role.WORKER).stream()
                .map(this::mapToProfileResponse)
                .collect(Collectors.toList());
    }

    public List<UserProfileResponse> getWorkersBySkill(String skillName) {
        return userRepository.findWorkersBySkill(skillName).stream()
                .map(this::mapToProfileResponse)
                .collect(Collectors.toList());
    }

    private UserProfileResponse mapToProfileResponse(User user) {
        Set<String> skillNames = user.getSkills().stream()
                .map(Skill::getName)
                .collect(Collectors.toSet());

        return UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .bio(user.getBio())
                .experience(user.getExperience())
                .latitude(user.getLatitude())
                .longitude(user.getLongitude())
                .address(user.getAddress())
                .role(user.getRole())
                .skills(skillNames)
                .averageRating(user.getAverageRating())
                .createdAt(user.getCreatedAt())
                .build();
    }
}