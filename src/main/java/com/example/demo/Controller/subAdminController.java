package com.example.demo.Controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.GetExchange;

import com.example.demo.ServiseLayer.SubAdminService;
import com.example.demo.entitys.SubAdmin;

@Controller
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class subAdminController {
	
	@Autowired
	SubAdminService sa;

	@PostMapping("/saveSub")
	public String savesubadmin(@RequestBody SubAdmin subadmin) {
		
		subadmin.setSid(UUID.randomUUID().toString());
		subadmin.setSrole("SUB_ADMIN");
		sa.savesub(subadmin);
		
		return "Sub Admin saved Suucesfully";
		
	}
	
	@GetMapping("/fetchdata")
	public List<SubAdmin> fetchAll() {
		  
		return sa.getdata();
	}
	

}
