package com.example.demo.DAOLayer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entitys.SubAdmin;

@Repository
public interface SubAdminRepo extends JpaRepository<SubAdmin, String> {

}
