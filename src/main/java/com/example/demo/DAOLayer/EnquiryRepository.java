package com.example.demo.DAOLayer;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entitys.Enquiry;

public interface EnquiryRepository extends JpaRepository<Enquiry, String> {
	List<Enquiry> findAllByOrderByCreatedAtDesc();
}
