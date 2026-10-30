package com.example.demo.ServiseLayer;

import java.util.Optional;

import com.example.demo.entitys.SuperAdmin;



public interface SuperAdminLayer {

	void saveAdmin(SuperAdmin admin);

	Optional<SuperAdmin> getAdmin(String email, String password);

	boolean adminEmailExists(String email);

}