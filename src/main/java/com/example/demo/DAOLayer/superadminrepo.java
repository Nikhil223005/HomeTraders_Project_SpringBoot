package com.example.demo.DAOLayer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entitys.SuperAdmin;

@Repository
public interface superadminrepo extends JpaRepository<SuperAdmin, String>{

}
