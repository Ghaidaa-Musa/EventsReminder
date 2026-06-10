package com.csc3402.lab.unieventreminder.repository;

import com.csc3402.lab.unieventreminder.model.UserInterest;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserInterestRepository extends JpaRepository<UserInterest, Integer> {
}
