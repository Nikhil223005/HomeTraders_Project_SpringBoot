package com.example.demo.entitys;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
public class SuperAdmin {
	
	@Id
	private String sa_id;
	private String sa_name;
	private String sa_email;
	private String sa_pass;
	private String sa_role;
	
	public String getSa_id() {
		return sa_id;
	}
	public void setSa_id(String sa_id) {
		this.sa_id = sa_id;
	}
	public String getSa_name() {
		return sa_name;
	}
	public void setSa_name(String sa_name) {
		this.sa_name = sa_name;
	}
	public String getSa_email() {
		return sa_email;
	}
	public void setSa_email(String sa_email) {
		this.sa_email = sa_email;
	}
	public String getSa_pass() {
		return sa_pass;
	}
	public void setSa_pass(String sa_pass) {
		this.sa_pass = sa_pass;
	}
	public String getSa_role() {
		return sa_role;
	}
	public void setSa_role(String sa_role) {
		this.sa_role = sa_role;
	}
	
	@Override
	public String toString() {
		return "SuperAdmin [sa_id=" + sa_id + ", sa_name=" + sa_name + ", sa_email=" + sa_email + ", sa_pass=" + sa_pass
				+ ", sa_role=" + sa_role + "]";
	}
	
	
}
