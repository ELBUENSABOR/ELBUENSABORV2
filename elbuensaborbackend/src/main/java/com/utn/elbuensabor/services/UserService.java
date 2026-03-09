package com.utn.elbuensabor.services;

import com.utn.elbuensabor.dtos.UserDTO;
import com.utn.elbuensabor.dtos.UserEditRequestDTO;
import com.utn.elbuensabor.dtos.UserRequestDTO;

import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface UserService {

    UserDTO createUser(UserRequestDTO dto);

    UserDTO getUser(Long id);

    List<UserDTO> getAllUsers();

    UserDTO updateUser(Long id, UserEditRequestDTO userDTO);

    UserDTO deleteUser(Long id);

    UserDTO reactivateUser(Long id);

    UserDTO updateProfilePhoto(Long id, MultipartFile file);
}
