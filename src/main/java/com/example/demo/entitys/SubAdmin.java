package com.example.demo.entitys;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class SubAdmin {

	@Id
	private String sid;
	private String sname;
	private String semail;
	private String smobile;
	private String srole;
	private String spass;
	private String scpass;
	public String getSid() {
		return sid;
	}
	public void setSid(String sid) {
		this.sid = sid;
	}
	public String getSname() {
		return sname;
	}
	public void setSname(String sname) {
		this.sname = sname;
	}
	public String getSemail() {
		return semail;
	}
	public void setSemail(String semail) {
		this.semail = semail;
	}
	public String getSmobile() {
		return smobile;
	}
	public void setSmobile(String smobile) {
		this.smobile = smobile;
	}
	public String getSrole() {
		return srole;
	}
	public void setSrole(String srole) {
		this.srole = srole;
	}
	public String getSpass() {
		return spass;
	}
	public void setSpass(String spass) {
		this.spass = spass;
	}
	public String getScpass() {
		return scpass;
	}
	public void setScpass(String scpass) {
		this.scpass = scpass;
	}
	@Override
	public String toString() {
		return "SubAdmin [sid=" + sid + ", sname=" + sname + ", semail=" + semail + ", smobile=" + smobile + ", srole="
				+ srole + ", spass=" + spass + ", scpass=" + scpass + "]";
	}
	
	
}
