package com.example.demo.Controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.DAOLayer.AappliedAgency;
import com.example.demo.ServiseLayer.AppliedAgency;
import com.example.demo.entitys.AppliedAgroAgency;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class AppliedAgencyController {
	
	@Autowired
	AppliedAgency agc;
	
	
	@PostMapping("/agency")
	public String saveagency(@RequestBody AppliedAgroAgency ag) {
		ag.setAaid(UUID.randomUUID().toString());
		agc.saveagency(ag);
		return "Agency for Applied";
	}
}
