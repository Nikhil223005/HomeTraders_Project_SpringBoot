package com.example.demo.ServiseLayer;



import java.util.List;
import java.util.Optional;

import com.example.demo.entitys.SubAdmin;

public interface SubAdminService {
	
	public void savesub(SubAdmin user);
	
	 public List<SubAdmin> getdata();

	 public Optional<SubAdmin> authenticateSubAdmin(String email, String password);

	 public Optional<SubAdmin> updateSubAdmin(String sid, SubAdmin updates);

	 public boolean deleteSubAdmin(String sid);
	
}
