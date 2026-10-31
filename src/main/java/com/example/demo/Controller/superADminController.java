package com.example.demo.Controller;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.ServiseLayer.SubAdminService;
import com.example.demo.ServiseLayer.SuperAdminLayer;
import com.example.demo.entitys.SubAdmin;
import com.example.demo.entitys.SuperAdmin;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/superadmin")
@CrossOrigin(origins = "http://localhost:3000")
public class superADminController {

    @Autowired
    private SuperAdminLayer as;

    @Autowired
    private SubAdminService subAdminService;

    // 1. Create Admin
    @PostMapping("/save")
    public String saveAdmin(@RequestBody SuperAdmin admin) {
        admin.setSaId(UUID.randomUUID().toString());
        admin.setSaRole("ADMIN");
        as.saveAdmin(admin);
        return "Admin saved successfully";
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> data, HttpSession session) {
        String email = data.get("email");
        String password = data.get("password");

        Optional<SuperAdmin> superAdmin = as.getAdmin(email, password);
        if (superAdmin.isPresent()) {
            SuperAdmin admin = superAdmin.get();
            session.setAttribute("adminName", admin.getSaName());
            session.setAttribute("adminEmail", admin.getSaEmail());
            session.setAttribute("adminRole", admin.getSaRole());
            Map<String, Object> profile = new LinkedHashMap<>();
            profile.put("id", admin.getSaId());
            profile.put("name", admin.getSaName());
            profile.put("email", admin.getSaEmail());
            profile.put("role", admin.getSaRole());
            profile.put("saId", admin.getSaId());
            profile.put("saName", admin.getSaName());
            profile.put("saEmail", admin.getSaEmail());
            profile.put("saRole", admin.getSaRole());
            return Map.of("status", "success", "admin", profile);
        }

        Optional<SubAdmin> subAdmin = subAdminService.authenticateSubAdmin(email, password);
        if (subAdmin.isPresent()) {
            SubAdmin admin = subAdmin.get();
            session.setAttribute("adminName", admin.getSname());
            session.setAttribute("adminEmail", admin.getSemail());
            session.setAttribute("adminRole", "SUB_ADMIN");
            Map<String, Object> profile = new LinkedHashMap<>();
            profile.put("id", admin.getSid());
            profile.put("name", admin.getSname());
            profile.put("email", admin.getSemail());
            profile.put("role", "SUB_ADMIN");
            profile.put("sid", admin.getSid());
            profile.put("sname", admin.getSname());
            profile.put("semail", admin.getSemail());
            profile.put("srole", "SUB_ADMIN");
            return Map.of("status", "success", "admin", profile);
        }

        return Map.of("status", "fail", "message", "Invalid email or password");
    }
    
    @GetMapping("/getSession")
    public Map<String, Object> getSession(HttpSession session) {
        String name = (String) session.getAttribute("adminName");
        if (name != null) {
            return Map.of("name", name);
        }
        return Map.of("name", "Not Logged In");
    }
}
