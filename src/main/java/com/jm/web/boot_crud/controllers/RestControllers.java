package com.jm.web.boot_crud.controllers;

import com.jm.web.boot_crud.model.Role;
import com.jm.web.boot_crud.model.User;
import com.jm.web.boot_crud.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
public class RestControllers {
    private final UserService userService;

    @Autowired
    public RestControllers(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/userInfo")
    public ResponseEntity<User> getUserInfo() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        currentUser.setPassword("");
        return ResponseEntity.ok().body(currentUser);
    }

    @GetMapping("/admin/user/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") Long id) throws ChangeSetPersister.NotFoundException {
        return ResponseEntity.ok().body(userService.getUserById(id));
    }

    @GetMapping("/admin/getAllUsers")
    public ResponseEntity<Iterable<User>> getAllUsers() {
        return ResponseEntity.ok().body(userService.getAllUsers());
    }

    @GetMapping("/admin/getAllRoles")
    public ResponseEntity<Iterable<Role>> getAllRoles() {
        List<Role> roles = userService.getAllRoles();
        return ResponseEntity.ok().body(roles);
    }

    @PostMapping("/admin/addUser")
    public ResponseEntity<Long> createUser(@RequestBody User user) {
        Set<Role> tmpRole = new HashSet<>();
        if (user.getRoles().isEmpty()) {
            tmpRole.add(userService.getRoleByName("USER"));
        } else {
            tmpRole = user.getRoles().stream().map(role -> userService.getRoleByName(role.getName())).collect(Collectors.toSet());
        }
        user.setRoles(tmpRole);
        userService.addUser(user);
        return new ResponseEntity<>(user.getId(), HttpStatus.OK);
    }

    @DeleteMapping("/admin/deleteUser/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable("id") Long id) {
        userService.delUser(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping("/admin/editUser")
    public ResponseEntity<?> editUser(@RequestBody User user) throws ChangeSetPersister.NotFoundException {
        Set<Role> tmpRole = new HashSet<>();
        if (user.getRoles().isEmpty()) {
            tmpRole.add(userService.getRoleByName("USER"));
        } else {
            tmpRole = user.getRoles().stream().map(role -> userService.getRoleByName(role.getName())).collect(Collectors.toSet());
        }
        user.setRoles(tmpRole);
        userService.updateUser(user);
        return new ResponseEntity<>(user.getId(), HttpStatus.OK);
    }

}
