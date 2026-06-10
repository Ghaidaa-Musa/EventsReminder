package com.csc3402.lab.unieventreminder.model;


import jakarta.persistence.*;

@Entity
@Table(name = "user_interests")
public class UserInterest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_interest_id")
    private Integer userInterestId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "interest_id", nullable = false)
    private Interest interest;

    // --- Constructors ---
    public UserInterest() {
    }

    public UserInterest(User user, Interest interest) {
        this.user = user;
        this.interest = interest;
    }

    // --- Getters and Setters ---
    public Integer getUserInterestId() {
        return userInterestId;
    }

    public void setUserInterestId(Integer userInterestId) {
        this.userInterestId = userInterestId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Interest getInterest() {
        return interest;
    }

    public void setInterest(Interest interest) {
        this.interest = interest;
    }
}