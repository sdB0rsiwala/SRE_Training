package com.spring_java.task_2.controller;

import com.spring_java.task_2.model.User;
import com.spring_java.task_2.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/java")
public class UserController {

    @Autowired
    UserService userService;

    @CrossOrigin(origins = "http://localhost:3000/")
    @PostMapping("/signin")
    public String signIn(@RequestBody Map<String, String> userData ){
        String email = userData.get("email");
        String password = userData.get("password");
        return userService.signIn(email, password);
    }

    @CrossOrigin(origins = "http://localhost:3000/")
    @PostMapping("/signup")
    public String signUp(@RequestBody Map<String, String> userData){
        String email = userData.get("email");
        String password = userData.get("password");
        String name = userData.get("name");
        return userService.signUp(email, password, name);
    }

    @CrossOrigin()
    @GetMapping("/users")
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }
}
