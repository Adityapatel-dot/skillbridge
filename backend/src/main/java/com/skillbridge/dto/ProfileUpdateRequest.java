package com.skillbridge.dto;

import lombok.*;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateRequest {
    private String fullName;
    private String bio;
    private String phone;
    private String experience;
    private Double latitude;
    private Double longitude;
    private String address;
    private Set<String> skillNames;
}