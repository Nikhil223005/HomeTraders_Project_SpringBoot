package com.example.demo.DAOLayer;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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



}
