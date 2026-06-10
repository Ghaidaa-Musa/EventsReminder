package com.csc3402.lab.unieventreminder.repository;

import com.csc3402.lab.unieventreminder.model.Interest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InterestRepository extends JpaRepository<Interest, Integer> {
}
