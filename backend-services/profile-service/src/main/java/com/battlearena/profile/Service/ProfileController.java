package com.battlearena.profile.Service;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    @GetMapping("/test")
    public String test() {
        return "Profile service is working!";
    }
}