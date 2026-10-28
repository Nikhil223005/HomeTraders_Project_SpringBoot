package com.example.demo.ServiseLayer;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.DAOLayer.AgencyApplicationRepository;
import com.example.demo.DAOLayer.EnquiryRepository;
import com.example.demo.entitys.AgencyApplication;
import com.example.demo.entitys.Enquiry;

@Service
public class AdminRequestService {

	private final EnquiryRepository enquiryRepository;
	private final AgencyApplicationRepository agencyApplicationRepository;

	public AdminRequestService(
			EnquiryRepository enquiryRepository,
			AgencyApplicationRepository agencyApplicationRepository) {
		this.enquiryRepository = enquiryRepository;
		this.agencyApplicationRepository = agencyApplicationRepository;
	}

	public Enquiry submitEnquiry(Enquiry enquiry) {
		return enquiryRepository.save(enquiry);
	}

	public List<Enquiry> getEnquiries() {
		return enquiryRepository.findAllByOrderByCreatedAtDesc();
	}

	@Transactional
	public Optional<Enquiry> updateEnquiryStatus(String id, String status) {
		return enquiryRepository.findById(id).map(enquiry -> {
			enquiry.setStatus(status);
			return enquiry;
		});
	}

	public AgencyApplication submitAgencyApplication(AgencyApplication application) {
		return agencyApplicationRepository.save(application);
	}

	public List<AgencyApplication> getAgencyApplications() {
		return agencyApplicationRepository.findAllByOrderByCreatedAtDesc();
	}

	@Transactional
	public Optional<AgencyApplication> updateAgencyApplicationStatus(String id, String status) {
		return agencyApplicationRepository.findById(id).map(application -> {
			application.setStatus(status);
			return application;
		});
	}
}
