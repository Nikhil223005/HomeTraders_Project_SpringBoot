package com.example.demo.entitys;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class SuperAdmin {
    
    @Id
    @Column(name = "sa_id")
    private String saId;
    
    @Column(name = "sa_name")
    private String saName;
    
    @Column(name = "sa_email")
    private String saEmail;
    
    @Column(name = "sa_pass")
    private String saPass;
    
    @Column(name = "sa_role")
    private String saRole;

	public String getSaId() {
		return saId;
	}

	public void setSaId(String saId) {
		this.saId = saId;
	}

	public String getSaName() {
		return saName;
	}

	public void setSaName(String saName) {
		this.saName = saName;
	}

	public String getSaEmail() {
		return saEmail;
	}

	public void setSaEmail(String saEmail) {
		this.saEmail = saEmail;
	}

	public String getSaPass() {
		return saPass;
	}

	public void setSaPass(String saPass) {
		this.saPass = saPass;
	}

	public String getSaRole() {
		return saRole;
	}

	public void setSaRole(String saRole) {
		this.saRole = saRole;
	}

	@Override
	public String toString() {
		return "SuperAdmin [saId=" + saId + ", saName=" + saName + ", saEmail=" + saEmail + ", saPass=" + saPass
				+ ", saRole=" + saRole + "]";
	}

    
}