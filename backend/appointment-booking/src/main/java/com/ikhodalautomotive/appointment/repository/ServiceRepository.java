package com.ikhodalautomotive.appointment.repository;
import com.ikhodalautomotive.appointment.model.Services;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Services, Long> {

    List<Services> findByIsActiveTrue();
}
