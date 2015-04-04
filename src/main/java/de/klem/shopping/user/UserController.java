package de.klem.shopping.user;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

/**
 * Created by Yannic on 04.04.2015.
 */
@RestController
public class UserController {
    @RequestMapping("/api/user")
    public Principal user(Principal user) {
        return user;
    }
}
