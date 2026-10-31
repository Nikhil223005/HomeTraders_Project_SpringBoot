package com.example.demo.DAOLayer;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Repos.SubAdminRepo;
import com.example.demo.ServiseLayer.SubAdminService;
import com.example.demo.entitys.SubAdmin;

@Service
public class SubAdminDoa implements SubAdminService {
	@Autowired
	SubAdminRepo sr;
	
	@Override
	public void savesub(SubAdmin user) {
		sr.save(user);
	}

	@Override
	public List<SubAdmin> getdata() {
		List<SubAdmin> l1 = sr.findAll();
	
		return l1;
	}

	@Override
	public Optional<SubAdmin> authenticateSubAdmin(String email, String password) {
		return sr.findBySemailIgnoreCaseAndSpass(email, password);
	}

	@Override
	public Optional<SubAdmin> updateSubAdmin(String sid, SubAdmin updates) {
		return sr.findById(sid).map(subAdmin -> {
			subAdmin.setSname(updates.getSname());
			subAdmin.setSemail(updates.getSemail());
			subAdmin.setSmobile(updates.getSmobile());
			return sr.save(subAdmin);
		});
	}

	@Override
	public boolean deleteSubAdmin(String sid) {
		return sr.findById(sid).map(subAdmin -> {
			sr.delete(subAdmin);
			return true;
		}).orElse(false);
	}

}
