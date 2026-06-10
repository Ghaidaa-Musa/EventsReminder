package com.csc3402.lab.unieventreminder.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "event_records")
public class EventRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Integer eventId;

    @Column(name = "event_title", nullable = false, length = 150)
    private String title;

    @Column(name = "event_description")
    private String description;

    @Column(name = "event_date")
    private LocalDate eventDate;

    @Column(name = "event_time")
    private String eventTime;

    @Column(name = "venue", length = 150)
    private String location;

    @Column(name = "organizer", length = 100)
    private String organizer;

    @Column(name = "target_audience", length = 100)
    private String targetAudience;

    @Column(name = "fees", length = 30)
    private String fees;

    @Column(name = "presented_by", length = 100)
    private String presentedBy;

    @Column(name = "certificate", length = 50)
    private String certificate;

    @ManyToOne
    @JoinColumn(name = "interest_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Interest interest;

    @Column(name = "created_by")
    private Integer createdBy;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<EventRegistration> registrations = new ArrayList<>();

    // --- Constructors ---
    public EventRecord() {
    }

    public EventRecord(String title, String description, LocalDate eventDate, String eventTime, String location, String organizer, String targetAudience, String fees, String presentedBy, String certificate, Interest interest, Integer createdBy) {
        this.title = title;
        this.description = description;
        this.eventDate = eventDate;
        this.eventTime = eventTime;
        this.location = location;
        this.organizer = organizer;
        this.targetAudience = targetAudience;
        this.fees = fees;
        this.presentedBy = presentedBy;
        this.certificate = certificate;
        this.interest = interest;
        this.createdBy = createdBy;
    }

    // --- Getters and Setters  ---
    public Integer getEventId() { return eventId; }
    public void setEventId(Integer eventId) { this.eventId = eventId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getEventDate() { return eventDate; }
    public void setEventDate(LocalDate eventDate) { this.eventDate = eventDate; }

    public String getEventTime() { return eventTime; }
    public void setEventTime(String eventTime) { this.eventTime = eventTime; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getOrganizer() { return organizer; }
    public void setOrganizer(String organizer) { this.organizer = organizer; }

    public String getTargetAudience() { return targetAudience; }
    public void setTargetAudience(String targetAudience) { this.targetAudience = targetAudience; }

    public String getFees() { return fees; }
    public void setFees(String fees) { this.fees = fees; }

    public String getPresentedBy() { return presentedBy; }
    public void setPresentedBy(String presentedBy) { this.presentedBy = presentedBy; }

    public String getCertificate() { return certificate; }
    public void setCertificate(String certificate) { this.certificate = certificate; }

    public Interest getInterest() { return interest; }
    public void setInterest(Interest interest) { this.interest = interest; }

    public Integer getCreatedBy() { return createdBy; }
    public void setCreatedBy(Integer createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<EventRegistration> getRegistrations() { return registrations; }
    public void setRegistrations(List<EventRegistration> registrations) { this.registrations = registrations; }
}