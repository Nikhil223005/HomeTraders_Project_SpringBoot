package com.example.demo.Controller;

import java.util.UUID;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.ServiseLayer.SuperAdminLayer;
import com.example.demo.entitys.SuperAdmin;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/superadmin")
@CrossOrigin(origins = "http://localhost:3000")
public class superADminController {

    @Autowired
    private SuperAdminLayer as;

    // 1. Create Admin
    @PostMapping("/save")
    public String saveAdmin(@RequestBody SuperAdmin admin) {
        admin.setSaId(UUID.randomUUID().toString());
        admin.setSaRole("ADMIN");
        as.saveAdmin(admin);
        return "Admin saved successfully";
    }


     

        @PostMapping("/login")
        public Map<String, Object> login(@RequestBody Map<String, String> data , HttpSession session) {
            String email = data.get("email");
            String password = data.get("password");

            Optional<SuperAdmin> admin = as.getAdmin(email, password);
            	
            if (admin.isPresent()) {
            	SuperAdmin a = admin.get();
            	session.setAttribute("adminName", a.getSaName());
                session.setAttribute("adminEmail", a.getSaEmail());
                return Map.of(
                    "status", "success",
                    "admin", admin.get()
                );    
                
                } else {
                return Map.of("status", "fail", "message", "Invalid email or password");
            }
        }
        @GetMapping("/getSession")
        public Map<String, Object> getSession(HttpSession session){
            String name = (String) session.getAttribute("adminName");
            if(name != null){
                return Map.of("name", name);
            } else {
                return Map.of("name", "Not Logged In");
            }
        }







}
    
