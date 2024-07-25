package com.spring_java.task_2.service;


import com.spring_java.task_2.model.User;
import com.spring_java.task_2.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;


@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder; // Autowire PasswordEncoder


    public String signIn(String email, String password){
        Optional<User> userOptional = userRepo.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (password.equals(user.getPassword())) {
                return "Login successful 200";
            } else {
                return "Invalid credentials 400";
            }
        } else {
            return "User not found";
        }
    }

    public String signUp(String email, String password, String name) {
        Optional<User> userOptional = userRepo.findByEmail(email);
        if (userOptional.isPresent()) {
            return "Email already registered";
        } else {
            User user = new User(name, email, password);
            userRepo.save(user);
            return "Registration successful";
        }
    }

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }
}
