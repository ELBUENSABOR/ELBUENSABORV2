package com.utn.elbuensabor.services;

import com.utn.elbuensabor.dtos.UserEditRequestDTO;
import com.utn.elbuensabor.dtos.UserRequestDTO;

import com.utn.elbuensabor.dtos.UserDTO;

import java.util.List;

public interface UserService {

    UserDTO createUser(UserRequestDTO dto);

    UserDTO getUser(Long id);

    List<UserDTO> getAllUsers();

    UserDTO updateUser(Long id, UserEditRequestDTO userDTO);

    UserDTO deleteUser(Long id);
}
