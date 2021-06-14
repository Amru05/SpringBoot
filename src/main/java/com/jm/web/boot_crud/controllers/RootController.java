package com.jm.web.boot_crud.controllers;

import com.jm.web.boot_crud.model.User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RootController {

    @GetMapping(value = "/")
    public String rootPage(@AuthenticationPrincipal User user) {
        if(user != null) {
            return "panel";
        }
        return "login";
    }

    @GetMapping(value = "/login")
    public String loginPage() {
        return "login";
    }

}
