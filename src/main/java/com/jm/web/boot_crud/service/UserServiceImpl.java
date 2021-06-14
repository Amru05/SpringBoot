package com.jm.web.boot_crud.service;

import com.jm.web.boot_crud.model.Role;
import com.jm.web.boot_crud.model.User;
import com.jm.web.boot_crud.repository.RoleRepository;
import com.jm.web.boot_crud.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(RoleRepository roleRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public List<User> getAllUsers() {
        List<User> userList = new ArrayList<>();
        userRepository.findAll().forEach(userList::add);
        return userList;
    }

    @Override
    @Transactional
    public Long addUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return user.getId();
    }

    @Override
    @Transactional
    public void delUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void updateUser(User user) throws ChangeSetPersister.NotFoundException {
        if (user.getPassword().isEmpty()) {
            user.setPassword(userRepository.findById(user.getId())
                    .orElseThrow(ChangeSetPersister.NotFoundException::new)
                    .getPassword());
        } else {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        userRepository.save(user);
    }

    @Override
    @Transactional
    public User getUserById(Long id) throws ChangeSetPersister.NotFoundException {
        return userRepository.findById(id)
                .orElseThrow(ChangeSetPersister.NotFoundException::new);
    }

    @Override
    @Transactional
    public User getUserByLogin(String login) {
        return userRepository.findByEmail(login);
    }

    @Override
    @Transactional
    public List<Role> getAllRoles() {
        List<Role> roleList = new ArrayList<>();
        roleRepository.findAll().forEach(roleList::add);
        return roleList;
    }

    @Override
    @Transactional
    public Role getRoleByName(String name) {
        return roleRepository.findByName(name);
    }

    @Override
    @Transactional
    public Role getRoleById(Long id) throws ChangeSetPersister.NotFoundException {
        return roleRepository.findById(id)
                .orElseThrow(ChangeSetPersister.NotFoundException::new);
    }

    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(s);
        if (user == null) {
            throw new UsernameNotFoundException("Unknown user with credentials: " + s);
        }
        return user;
    }

    @Override
    @Transactional
    @PostConstruct
    public void initDB() {
        if (roleRepository.findByName("ADMIN") == null) {
            System.out.println("Let's create a role 'ADMIN' necessary for work");
            roleRepository.save(new Role("ADMIN"));
        }
        if (roleRepository.findByName("USER") == null) {
            System.out.println("Let's create a role 'USER' necessary for work");
            roleRepository.save(new Role("USER"));
        }
        if (userRepository.findByEmail("admin@mail.ru") == null) {
            System.out.println("Let's create admin-user necessary for work, with credentials: \n" +
                    "'admin@mail.ru' /  'password'");
            User user = new User("Admin",
                    "Adminus",
                    42,
                    "admin@mail.ru",
                    "password",
                    new HashSet<Role>() {{
                        add(roleRepository.findByName("ADMIN"));
                        add(roleRepository.findByName("USER"));
                    }});
            addUser(user);
        }
    }

}
