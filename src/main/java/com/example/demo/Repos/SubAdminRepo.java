package com.example.demo.Repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

import com.example.demo.entitys.SubAdmin;

@Repository
public interface SubAdminRepo extends JpaRepository<SubAdmin, String> {

	Optional<SubAdmin> findBySemailIgnoreCaseAndSpass(String semail, String spass);

}
