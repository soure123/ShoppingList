package de.klem.shopping.security.user;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Collection;
import java.util.Set;

/**
 * Created by Yannic on 05.04.2015.
 */
@Entity
@Table(name = "users")
public class User extends org.springframework.security.core.userdetails.User{

    @Id
    private String username;

    @NotNull
    private String password;

    @NotNull
    private boolean enabled = true;

    @OneToMany(mappedBy = "username")
    private Set<Authority> authorities;

    public User(String username, String password, Collection<? extends Authority> authorities) {
        super(username, password, authorities);
    }
}
