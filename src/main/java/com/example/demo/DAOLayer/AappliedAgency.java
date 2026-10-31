package com.example.demo.DAOLayer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.example.demo.Repos.AppliedAgencyRepo;
import com.example.demo.ServiseLayer.AppliedAgency;
import com.example.demo.entitys.AppliedAgroAgency;

@Repository
public class AappliedAgency implements AppliedAgency{

	@Autowired
	AppliedAgencyRepo agr;
	
	
	
	@Override
	public void saveagency(AppliedAgroAgency ag) {
		agr.save(ag);
	}

}
