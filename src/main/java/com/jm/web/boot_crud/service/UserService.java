package com.jm.web.boot_crud.service;

import com.jm.web.boot_crud.model.Role;
import com.jm.web.boot_crud.model.User;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {

    List<User> getAllUsers();
    User getUserById(Long id) throws ChangeSetPersister.NotFoundException;
    User getUserByLogin(String login);

    List<Role> getAllRoles();
    Role getRoleById(Long id) throws ChangeSetPersister.NotFoundException;
    Role getRoleByName(String name);

    Long addUser(User user);
    void delUser(Long id);
    void updateUser(User user) throws ChangeSetPersister.NotFoundException;

    void initDB();
}
