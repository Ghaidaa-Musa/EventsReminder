package com.csc3402.lab.unieventreminder.repository;

import com.csc3402.lab.unieventreminder.model.EventRecord;
import com.csc3402.lab.unieventreminder.model.EventRegistration;
import com.csc3402.lab.unieventreminder.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    List<EventRegistration> findByUser(User user);
    List<EventRegistration> findByEvent(EventRecord event);
    Optional<EventRegistration> findByUserAndEvent(User user, EventRecord event);
    boolean existsByUserAndEvent(User user, EventRecord event);
}
