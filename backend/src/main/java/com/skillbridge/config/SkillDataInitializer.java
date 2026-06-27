package com.skillbridge.config;

import com.skillbridge.entity.Skill;
import com.skillbridge.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@Order(1)
@RequiredArgsConstructor
public class SkillDataInitializer implements CommandLineRunner {

    private final SkillRepository skillRepository;

    @Override
    public void run(String... args) {
        List<String> skills = Arrays.asList(
            "Electrician", "Plumber", "Carpenter", "Painter", "Welder",
            "Driver", "Cook", "Cleaner", "Helper", "Security Guard",
            "Mechanic", "Mason", "Tiles Helper", "AC Repair", "Appliance Repair",
            "Gardener", "Tailor", "Baby Sitter", "Elderly Care", "Delivery Boy"
        );

        for (String skillName : skills) {
            if (!skillRepository.existsByNameIgnoreCase(skillName)) {
                Skill skill = Skill.builder()
                        .name(skillName)
                        .category("General")
                        .build();
                skillRepository.save(skill);
            }
        }
    }
}