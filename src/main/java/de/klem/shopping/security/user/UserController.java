package de.klem.shopping.security.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Yannic on 04.04.2015.
 */
@RestController
public class UserController {

    @Autowired
    private DataSource datasource;

    @RequestMapping("/api/user")
    public Principal user(Principal user) {
        return user;
    }

    @RequestMapping(value = "api/user", method = RequestMethod.POST)
    public void createUser(@RequestBody UserResource user){
        JdbcUserDetailsManager userDetailsManager = new JdbcUserDetailsManager();
        userDetailsManager.setDataSource(datasource);
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("USER"));
        org.springframework.security.core.userdetails.User userDetails = new org.springframework.security.core.userdetails.User(user.getUsername(), encoder.encode(user.getPassword()), authorities);

        userDetailsManager.createUser(userDetails);
    }
}
