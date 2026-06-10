package com.csc3402.lab.unieventreminder.service;

import com.csc3402.lab.unieventreminder.model.EventRecord;
import com.csc3402.lab.unieventreminder.repository.EventRecordRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EventService {
    private final EventRecordRepository eventRecordRepository;
    //Repository
    public EventService(EventRecordRepository eventRecordRepository) {
        this.eventRecordRepository = eventRecordRepository;
    }
    //Controller
    public List<EventRecord> findAll() {
        return eventRecordRepository.findAll();
    }
}