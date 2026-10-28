package com.example.demo.DAOLayer;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.entitys.SuperAdmin;

@Repository
public interface superadminrepo extends JpaRepository<SuperAdmin, String>{

	@Query("select admin from SuperAdmin admin where admin.sa_email = :email and admin.sa_pass = :password")
	Optional<SuperAdmin> findByEmailAndPassword(
			@Param("email") String email,
			@Param("password") String password);

}
