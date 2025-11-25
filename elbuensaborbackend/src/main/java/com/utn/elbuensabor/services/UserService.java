package com.utn.elbuensabor.services;

import com.utn.elbuensabor.dtos.UserDTO;

public interface UserService {

    UserDTO getUser(Long id);

    UserDTO updateUser(Long id, UserDTO userDTO);

}
