package com.example.demo.DAOLayer;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Repos.superadminrepo;
import com.example.demo.ServiseLayer.SuperAdminLayer;
import com.example.demo.entitys.SuperAdmin;

@Service
public class Superadmindao implements SuperAdminLayer {
	
	@Autowired
	superadminrepo ss;
	
	@Override
	public void saveAdmin(SuperAdmin admin) {
		ss.save(admin);
	}

	@Override
	public Optional<SuperAdmin> getAdmin(String email, String password) {
		return ss.findBySaEmailAndSaPass(email, password);
	}

	@Override
	public boolean adminEmailExists(String email) {
		return ss.existsBySaEmailIgnoreCase(email);
	}

}
