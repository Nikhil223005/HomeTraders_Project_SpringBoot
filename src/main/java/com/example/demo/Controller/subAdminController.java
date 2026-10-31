package com.example.demo.Controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.ServiseLayer.SubAdminService;
import com.example.demo.entitys.SubAdmin;

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
	
	@PutMapping("/updateSub/{sid}")
	public SubAdmin update(@PathVariable String sid, @RequestBody SubAdmin user) {
		return sa.updateSubAdmin(sid, user)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sub-admin not found"));
	}

	@DeleteMapping("/deleteSub/{sid}")
	public void delete(@PathVariable String sid) {
		if (!sa.deleteSubAdmin(sid)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Sub-admin not found");
		}
	}

}
