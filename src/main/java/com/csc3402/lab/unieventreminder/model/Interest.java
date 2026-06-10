package com.csc3402.lab.unieventreminder.model;

import jakarta.persistence.*;

@Entity
@Table(name = "interests")
public class Interest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "interest_id")
    private Integer interestId;

    @Column(name = "category_name", nullable = false, unique = true, length = 50)
    private String categoryName;

    // --- Constructors ---
    public Interest() {
    }

    public Interest(String categoryName) {
        this.categoryName = categoryName;
    }

    // --- Getters and Setters ---
    public Integer getInterestId() {
        return interestId;
    }

    public void setInterestId(Integer interestId) {
        this.interestId = interestId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
}
