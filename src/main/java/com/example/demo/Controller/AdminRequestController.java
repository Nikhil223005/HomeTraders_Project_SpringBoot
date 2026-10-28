package com.example.demo.Controller;

import java.util.List;
import java.util.Locale;
import java.util.Map;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.ServiseLayer.AdminRequestService;
import com.example.demo.entitys.AgencyApplication;
import com.example.demo.entitys.Enquiry;

@RestController
@RequestMapping("/api")
public class AdminRequestController {

	private static final String[] ENQUIRY_STATUSES = {"PENDING", "RESOLVED"};
	private static final String[] AGENCY_STATUSES = {"PENDING", "ACCEPTED", "REJECTED"};

	@Autowired
	private AdminRequestService requestService;

	@PostMapping("/enquiries")
	public ResponseEntity<?> submitEnquiry(@RequestBody EnquiryRequest request) {
		if (request == null || isBlank(request.name()) || isBlank(request.email())
				|| isBlank(request.topic()) || isBlank(request.message())) {
			return ResponseEntity.badRequest().body(Map.of("message", "All enquiry fields are required."));
		}

		Enquiry enquiry = requestService.submitEnquiry(new Enquiry(
				request.name().trim(),
				request.email().trim(),
				request.topic().trim(),
				request.message().trim()));
		return ResponseEntity.status(HttpStatus.CREATED).body(enquiry);
	}

	@PostMapping("/agency-applications")
	public ResponseEntity<?> submitAgencyApplication(@RequestBody AgencyApplicationRequest request) {
		if (request == null || isBlank(request.agencyName()) || isBlank(request.contactName())
				|| isBlank(request.email()) || isBlank(request.phone())
				|| isBlank(request.serviceArea()) || isBlank(request.description())) {
			return ResponseEntity.badRequest().body(Map.of("message", "All agency application fields are required."));
		}

		AgencyApplication application = requestService.submitAgencyApplication(new AgencyApplication(
				request.agencyName().trim(),
				request.contactName().trim(),
				request.email().trim(),
				request.phone().trim(),
				request.serviceArea().trim(),
				request.description().trim()));
		return ResponseEntity.status(HttpStatus.CREATED).body(application);
	}

	@GetMapping("/superadmin/enquiries")
	public ResponseEntity<?> getEnquiries(HttpSession session) {
		if (!isAdmin(session)) {
			return unauthorized();
		}
		List<Enquiry> enquiries = requestService.getEnquiries();
		return ResponseEntity.ok(enquiries);
	}

	@PatchMapping("/superadmin/enquiries/{id}/status")
	public ResponseEntity<?> updateEnquiryStatus(
			@PathVariable String id,
			@RequestBody StatusRequest request,
			HttpSession session) {
		if (!isAdmin(session)) {
			return unauthorized();
		}
		if (request == null || !hasStatus(ENQUIRY_STATUSES, request.status())) {
			return ResponseEntity.badRequest().body(Map.of("message", "Status must be PENDING or RESOLVED."));
		}
		return requestService.updateEnquiryStatus(id, request.status().toUpperCase(Locale.ROOT))
				.<ResponseEntity<?>>map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@GetMapping("/superadmin/agency-applications")
	public ResponseEntity<?> getAgencyApplications(HttpSession session) {
		if (!isAdmin(session)) {
			return unauthorized();
		}
		List<AgencyApplication> applications = requestService.getAgencyApplications();
		return ResponseEntity.ok(applications);
	}

	@PatchMapping("/superadmin/agency-applications/{id}/status")
	public ResponseEntity<?> updateAgencyApplicationStatus(
			@PathVariable String id,
			@RequestBody StatusRequest request,
			HttpSession session) {
		if (!isAdmin(session)) {
			return unauthorized();
		}
		if (request == null || !hasStatus(AGENCY_STATUSES, request.status())) {
			return ResponseEntity.badRequest()
					.body(Map.of("message", "Status must be PENDING, ACCEPTED, or REJECTED."));
		}
		return requestService.updateAgencyApplicationStatus(id, request.status().toUpperCase(Locale.ROOT))
				.<ResponseEntity<?>>map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	private boolean isAdmin(HttpSession session) {
		return session.getAttribute("superAdminId") != null;
	}

	private ResponseEntity<Map<String, String>> unauthorized() {
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
				.body(Map.of("message", "Please sign in as a super admin."));
	}

	private boolean hasStatus(String[] allowedStatuses, String status) {
		if (status == null) {
			return false;
		}
		for (String allowedStatus : allowedStatuses) {
			if (allowedStatus.equalsIgnoreCase(status)) {
				return true;
			}
		}
		return false;
	}

	private boolean isBlank(String value) {
		return value == null || value.isBlank();
	}

	public record EnquiryRequest(String name, String email, String topic, String message) {}

	public record AgencyApplicationRequest(
			String agencyName,
			String contactName,
			String email,
			String phone,
			String serviceArea,
			String description) {}

	public record StatusRequest(String status) {}
}
