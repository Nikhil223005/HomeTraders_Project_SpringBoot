package com.example.demo.entitys;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;

@Entity
public class Enquiry {

	@Id
	private String id;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	private String email;

	@Column(nullable = false)
	private String topic;

	@Column(nullable = false, length = 2000)
	private String message;

	@Column(nullable = false)
	private String status = "PENDING";

	@Column(nullable = false)
	private LocalDateTime createdAt;

	protected Enquiry() {}

	public Enquiry(String name, String email, String topic, String message) {
		this.id = java.util.UUID.randomUUID().toString();
		this.name = name;
		this.email = email;
		this.topic = topic;
		this.message = message;
	}

	@PrePersist
	void setCreatedAt() {
		if (createdAt == null) {
			createdAt = LocalDateTime.now();
		}
	}

	public String getId() { return id; }
	public String getName() { return name; }
	public String getEmail() { return email; }
	public String getTopic() { return topic; }
	public String getMessage() { return message; }
	public String getStatus() { return status; }
	public LocalDateTime getCreatedAt() { return createdAt; }
	public void setStatus(String status) { this.status = status; }
}
