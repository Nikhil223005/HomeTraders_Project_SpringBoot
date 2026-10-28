package com.example.demo.entitys;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;

@Entity
public class AgencyApplication {

	@Id
	private String id;

	@Column(nullable = false)
	private String agencyName;

	@Column(nullable = false)
	private String contactName;

	@Column(nullable = false)
	private String email;

	@Column(nullable = false)
	private String phone;

	@Column(nullable = false)
	private String serviceArea;

	@Column(nullable = false, length = 2000)
	private String description;

	@Column(nullable = false)
	private String status = "PENDING";

	@Column(nullable = false)
	private LocalDateTime createdAt;

	protected AgencyApplication() {}

	public AgencyApplication(
			String agencyName,
			String contactName,
			String email,
			String phone,
			String serviceArea,
			String description) {
		this.id = UUID.randomUUID().toString();
		this.agencyName = agencyName;
		this.contactName = contactName;
		this.email = email;
		this.phone = phone;
		this.serviceArea = serviceArea;
		this.description = description;
	}

	@PrePersist
	void setCreatedAt() {
		if (createdAt == null) {
			createdAt = LocalDateTime.now();
		}
	}

	public String getId() { return id; }
	public String getAgencyName() { return agencyName; }
	public String getContactName() { return contactName; }
	public String getEmail() { return email; }
	public String getPhone() { return phone; }
	public String getServiceArea() { return serviceArea; }
	public String getDescription() { return description; }
	public String getStatus() { return status; }
	public LocalDateTime getCreatedAt() { return createdAt; }
	public void setStatus(String status) { this.status = status; }
}
