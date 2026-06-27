package com.skillbridge.config;

import com.skillbridge.entity.Job;
import com.skillbridge.entity.Skill;
import com.skillbridge.entity.User;
import com.skillbridge.enums.JobStatus;
import com.skillbridge.enums.Role;
import com.skillbridge.repository.JobRepository;
import com.skillbridge.repository.SkillRepository;
import com.skillbridge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Order(2)
public class DemoDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final JobRepository jobRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        User demoClient = userRepository.findByEmail("demo.client@skillbridge.com").orElse(null);
        if (demoClient == null) {
            demoClient = User.builder()
                    .fullName("Demo Client")
                    .email("demo.client@skillbridge.com")
                    .password(passwordEncoder.encode("password123"))
                    .role(Role.CLIENT)
                    .address("Bangalore, Karnataka")
                    .build();
            demoClient = userRepository.save(demoClient);
            System.out.println("Created demo client: demo.client@skillbridge.com");
        }

        User demoWorker = userRepository.findByEmail("demo.worker@skillbridge.com").orElse(null);
        if (demoWorker == null) {
            demoWorker = User.builder()
                    .fullName("Demo Worker")
                    .email("demo.worker@skillbridge.com")
                    .password(passwordEncoder.encode("password123"))
                    .role(Role.WORKER)
                    .address("Bangalore, Karnataka")
                    .build();
            demoWorker = userRepository.save(demoWorker);
            System.out.println("Created demo worker: demo.worker@skillbridge.com");
        }

        List<String> skillNames = List.of(
            "Electrician", "Plumber", "Carpenter", "Painter", "Welder",
            "Driver", "Cook", "Cleaner", "Helper", "Security Guard",
            "Mechanic", "Mason", "Tiles Helper", "AC Repair", "Appliance Repair",
            "Gardener", "Tailor", "Baby Sitter", "Elderly Care", "Delivery Boy"
        );

        List<Skill> skills = skillRepository.findAll();
        String[] descriptions = {
            "Need an experienced electrician for home wiring and electrical fittings. Must have prior experience.",
            "Looking for a plumber to fix bathroom fittings and pipeline issues. Urgent requirement.",
            "Need a skilled carpenter for custom furniture making and woodwork.",
            "Looking for a painter for interior wall painting of a 2BHK apartment.",
            "Need a certified welder for metal fabrication work at construction site.",
            "Require a driver for daily office commute. Should have valid license.",
            "Need a cook for home-style meals. Breakfast and lunch required.",
            "Looking for a cleaner for office premises. Daily cleaning required.",
            "Need a helper for shifting household items and general assistance.",
            "Require a trained security guard for night shift at residential complex.",
            "Need an experienced mechanic for car repair and servicing.",
            "Looking for a skilled mason for brickwork and plastering.",
            "Need a tiles helper for bathroom and kitchen tile installation.",
            "AC not cooling properly. Need a technician for repair and servicing.",
            "Washing machine and refrigerator not working. Need appliance repair.",
            "Looking for a gardener for lawn maintenance and plant care.",
            "Need a tailor for stitching and alteration work.",
            "Looking for a responsible baby sitter for evening hours.",
            "Need a caregiver for elderly parent during daytime.",
            "Require a delivery boy for parcel delivery within the city."
        };

        for (int i = 0; i < skillNames.size(); i++) {
            String skillName = skillNames.get(i);
            Skill skill = skills.stream()
                    .filter(s -> s.getName().equalsIgnoreCase(skillName))
                    .findFirst()
                    .orElse(null);

            if (skill == null) continue;

            String title = "Need a " + skillName;
            String description = descriptions[i];

            double lat = 12.85 + (Math.random() * 0.45);
            double lng = 77.50 + (Math.random() * 0.35);

            var existing = jobRepository.findByClientIdAndTitle(demoClient.getId(), title);
            if (existing.isPresent()) {
                Job job = existing.get();
                job.setLatitude(lat);
                job.setLongitude(lng);
                job.setAddress("Bangalore, Karnataka");
                jobRepository.save(job);
                continue;
            }

            Job job = Job.builder()
                    .title(title)
                    .description(description)
                    .budget(new java.math.BigDecimal(500 + (i * 100)))
                    .address("Bangalore, Karnataka")
                    .latitude(lat)
                    .longitude(lng)
                    .status(JobStatus.OPEN)
                    .client(demoClient)
                    .requiredSkills(new java.util.HashSet<>(Set.of(skill)))
                    .build();

            jobRepository.save(job);
        }

        String[] extraTitles = {
            "Need a Home Electrician for Rewiring",
            "Need Bathroom Plumbing Work",
            "Need Modular Kitchen Carpenter",
            "Need Wall Painting Service",
            "Need Gas Welding Work",
            "Need Part-Time Driver",
            "Need Evening Cook",
            "Need Deep Cleaning Service",
            "Need Moving Helpers",
            "Need Gate Security Guard"
        };

        String[] extraDescriptions = {
            "Need an electrician for complete home rewiring and new switchboard installation. Safety certification required.",
            "Looking for a plumber to fix leaking pipes and install new bathroom fixtures in Bangalore.",
            "Need a carpenter for modular kitchen design and installation with modern fittings.",
            "Looking for a painter for exterior and interior painting of a 3BHK villa. Quality work expected.",
            "Need a certified welder for gate and railing fabrication work in Bangalore.",
            "Require a part-time driver for evening school pickup and drop. Must know Bangalore routes.",
            "Need a cook for evening dinner preparation. North and South Indian cuisine required.",
            "Looking for a cleaner for deep cleaning of a 2BHK apartment. All rooms including kitchen.",
            "Need strong helpers for office shifting and furniture relocation within Bangalore.",
            "Require a trained security guard for gated community day shift monitoring."
        };

        for (int i = 0; i < extraTitles.length; i++) {
            String title = extraTitles[i];
            String description = extraDescriptions[i];

            double lat = 12.85 + (Math.random() * 0.45);
            double lng = 77.50 + (Math.random() * 0.35);

            var existing = jobRepository.findByClientIdAndTitle(demoClient.getId(), title);
            if (existing.isPresent()) {
                Job job = existing.get();
                job.setLatitude(lat);
                job.setLongitude(lng);
                job.setAddress("Bangalore, Karnataka");
                jobRepository.save(job);
                continue;
            }

            Skill skill = skills.get(i % skills.size());

            Job job = Job.builder()
                    .title(title)
                    .description(description)
                    .budget(new java.math.BigDecimal(3000 + (i * 200)))
                    .address("Bangalore, Karnataka")
                    .latitude(lat)
                    .longitude(lng)
                    .status(JobStatus.OPEN)
                    .client(demoClient)
                    .requiredSkills(new java.util.HashSet<>(Set.of(skill)))
                    .build();

            jobRepository.save(job);
        }
    }
}
