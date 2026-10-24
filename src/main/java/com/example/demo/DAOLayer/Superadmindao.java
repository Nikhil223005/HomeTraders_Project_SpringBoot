package com.example.demo.DAOLayer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.ServiseLayer.SuperAdminLayer;
import com.example.demo.entitys.SuperAdmin;

@Service
public class Superadmindao implements SuperAdminLayer {
	
	@Autowired
	superadminrepo ss;
	
	@Override
	public void saveAdmin(SuperAdmin as) {
		ss.save(as);
		
	}

}
