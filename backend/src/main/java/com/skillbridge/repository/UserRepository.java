package com.skillbridge.repository;

import com.skillbridge.entity.User;
import com.skillbridge.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByResetToken(String resetToken);
    boolean existsByEmail(String email);
    List<User> findByRole(Role role);

    @Query("SELECT u FROM User u JOIN u.skills s WHERE s.name = :skillName AND u.role = 'WORKER'")
    List<User> findWorkersBySkill(@Param("skillName") String skillName);
}