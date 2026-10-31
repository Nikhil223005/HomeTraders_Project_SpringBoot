package com.example.demo.entitys;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@Entity
@Table(name="Agro_Agency")
public class AgroAgency {
	@Id
	private String Aid;
	private String Aname;
	private String Acontact;
	private String Aemail;
	private String Amobile;
	private String Aplace;
	private String Anotes;
	public String getAid() {
		return Aid;
	}
	public void setAid(String aid) {
		Aid = aid;
	}
	public String getAname() {
		return Aname;
	}
	public void setAname(String aname) {
		Aname = aname;
	}
	public String getAcontact() {
		return Acontact;
	}
	public void setAcontact(String acontact) {
		Acontact = acontact;
	}
	public String getAemail() {
		return Aemail;
	}
	public void setAemail(String aemail) {
		Aemail = aemail;
	}
	public String getAmobile() {
		return Amobile;
	}
	public void setAmobile(String amobile) {
		Amobile = amobile;
	}
	public String getAplace() {
		return Aplace;
	}
	public void setAplace(String aplace) {
		Aplace = aplace;
	}
	public String getAnotes() {
		return Anotes;
	}
	public void setAnotes(String anotes) {
		Anotes = anotes;
	}
	
	@Override
	public String toString() {
		return "AgroAgency [Aid=" + Aid + ", Aname=" + Aname + ", Acontact=" + Acontact + ", Aemail=" + Aemail
				+ ", Amobile=" + Amobile + ", Aplace=" + Aplace + ", Anotes=" + Anotes + "]";
	}
	
	
	
	
	
}
