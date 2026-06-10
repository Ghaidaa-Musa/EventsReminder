package com.csc3402.lab.unieventreminder.repository;

import com.csc3402.lab.unieventreminder.model.EventRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRecordRepository extends JpaRepository<EventRecord, Long> {

}

