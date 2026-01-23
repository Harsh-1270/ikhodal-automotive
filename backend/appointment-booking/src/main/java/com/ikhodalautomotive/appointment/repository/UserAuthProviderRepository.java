package com.ikhodalautomotive.appointment.repository;

import com.ikhodalautomotive.appointment.model.UserAuthProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserAuthProviderRepository extends JpaRepository<UserAuthProvider, Long> {
}
