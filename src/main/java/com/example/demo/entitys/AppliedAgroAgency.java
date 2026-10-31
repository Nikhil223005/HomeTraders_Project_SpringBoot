package com.example.demo.entitys;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="Application_Agency")
public class AppliedAgroAgency {
	
	@Id
	private String aaid;
	private String aaname;
	private String aacontact;
	private String aaemail;
	private String aamobile;
	private String aaplace;
	private String aanote;
	public String getAaid() {
		return aaid;
	}
	public void setAaid(String aaid) {
		this.aaid = aaid;
	}
	public String getAaname() {
		return aaname;
	}
	public void setAaname(String aaname) {
		this.aaname = aaname;
	}
	public String getAacontact() {
		return aacontact;
	}
	public void setAacontact(String aacontact) {
		this.aacontact = aacontact;
	}
	public String getAaemail() {
		return aaemail;
	}
	public void setAaemail(String aaemail) {
		this.aaemail = aaemail;
	}
	public String getAamobile() {
		return aamobile;
	}
	public void setAamobile(String aamobile) {
		this.aamobile = aamobile;
	}
	public String getAaplace() {
		return aaplace;
	}
	public void setAaplace(String aaplace) {
		this.aaplace = aaplace;
	}
	public String getAanote() {
		return aanote;
	}
	public void setAanote(String aanote) {
		this.aanote = aanote;
	}
	
	@Override
	public String toString() {
		return "AppliedAgroAgency [aaid=" + aaid + ", aaname=" + aaname + ", aacontact=" + aacontact + ", aaemail="
				+ aaemail + ", aamobile=" + aamobile + ", aaplace=" + aaplace + ", aanote=" + aanote + "]";
	}
	

}
