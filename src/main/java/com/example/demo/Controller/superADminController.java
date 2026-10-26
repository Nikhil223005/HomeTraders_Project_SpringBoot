package com.example.demo.Controller;

import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.ServiseLayer.SuperAdminLayer;
import com.example.demo.entitys.SuperAdmin;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class superADminController {
	@Autowired
	SuperAdminLayer as;

	@PostMapping("/save")
	public String one(@RequestBody SuperAdmin user) {
		user.setSa_id(UUID.randomUUID().toString());
		as.saveAdmin(user);
	    System.out.println("Saved: " + user.getSa_name() + " | " + user.getSa_email() + " | ID=" + user.getSa_id());
	    return "Saved Super admin data ID: " + user.getSa_id();
	}
	
	
	@PostMapping("/Login")
	public String two(@RequestBody String s , String y) {
		
		return null;
	}

}
