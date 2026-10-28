package com.example.demo.DAOLayer;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entitys.AgencyApplication;

public interface AgencyApplicationRepository extends JpaRepository<AgencyApplication, String> {
	List<AgencyApplication> findAllByOrderByCreatedAtDesc();
}
