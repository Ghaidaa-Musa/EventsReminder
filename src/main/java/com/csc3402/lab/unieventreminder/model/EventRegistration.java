package com.csc3402.lab.unieventreminder.model;
import jakarta.persistence.*;
        import java.time.LocalDateTime;

@Entity
@Table(name = "event_registrations")
public class EventRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private EventRecord event;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "registered_at")
    private LocalDateTime registeredAt;

    @Column(name = "attended")
    private boolean attended = false;

    @Column(name = "attended_at")
    private LocalDateTime attendedAt;

    public EventRegistration() {}

    public EventRegistration(EventRecord event, User user) {
        this.event = event;
        this.user = user;
        this.registeredAt = LocalDateTime.now();
        this.attended = false;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public EventRecord getEvent() { return event; }
    public void setEvent(EventRecord event) { this.event = event; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDateTime getRegisteredAt() { return registeredAt; }
    public void setRegisteredAt(LocalDateTime registeredAt) { this.registeredAt = registeredAt; }

    public boolean isAttended() { return attended; }
    public void setAttended(boolean attended) { this.attended = attended; }

    public LocalDateTime getAttendedAt() { return attendedAt; }
    public void setAttendedAt(LocalDateTime attendedAt) { this.attendedAt = attendedAt; }
}