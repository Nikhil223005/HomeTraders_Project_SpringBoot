package com.example.demo.Controller;

import java.util.UUID;
import java.util.Optional;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.ServiseLayer.SuperAdminLayer;
import com.example.demo.entitys.SuperAdmin;

@RestController
@RequestMapping("/api")
public class superADminController {

	@Autowired
	private SuperAdminLayer as;

	@PostMapping("/save")
	public String one(@RequestBody SuperAdmin user) {
		user.setSa_id(UUID.randomUUID().toString());
		as.saveAdmin(user);
		System.out.println("Saved super admin: " + user.getSa_email() + " | ID=" + user.getSa_id());
		return "Saved Super admin data ID: " + user.getSa_id();
	}

	@PostMapping("/superadmin/login")
	public ResponseEntity<LoginResponse> login(
			@RequestBody LoginRequest request,
			HttpSession session) {
		if (request == null || request.email() == null || request.email().isBlank()
				|| request.password() == null || request.password().isBlank()) {
			return ResponseEntity.badRequest()
					.body(new LoginResponse("Email and password are required.", null));
		}

		Optional<SuperAdmin> admin = as.getAdmin(request.email().trim(), request.password());
		if (admin.isEmpty()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(new LoginResponse("Invalid email or password.", null));
		}

		SuperAdmin authenticatedAdmin = admin.get();
		session.setAttribute("superAdminId", authenticatedAdmin.getSa_id());
		session.setMaxInactiveInterval(30 * 60);
		AdminSummary summary = new AdminSummary(
				authenticatedAdmin.getSa_id(),
				authenticatedAdmin.getSa_name(),
				authenticatedAdmin.getSa_email(),
				authenticatedAdmin.getSa_role());
		return ResponseEntity.ok(new LoginResponse("Login successful.", summary));
	}

	@PostMapping("/superadmin/logout")
	public ResponseEntity<Void> logout(HttpSession session) {
		session.invalidate();
		return ResponseEntity.noContent().build();
	}

	public record LoginRequest(String email, String password) {}

	public record AdminSummary(String id, String name, String email, String role) {}

	public record LoginResponse(String message, AdminSummary admin) {}
}
