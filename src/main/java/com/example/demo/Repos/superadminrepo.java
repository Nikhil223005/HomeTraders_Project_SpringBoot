package com.example.demo.Repos;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.entitys.SuperAdmin;

@Repository
public interface superadminrepo extends JpaRepository<SuperAdmin, String>{

	 Optional<SuperAdmin> findBySaEmailAndSaPass(String saEmail, String saPass);

	 boolean existsBySaEmailIgnoreCase(String saEmail);
}
