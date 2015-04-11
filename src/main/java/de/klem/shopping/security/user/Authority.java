package de.klem.shopping.security.user;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.util.Assert;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

/**
 * Created by Yannic on 11.04.2015.
 */
@Getter
@Setter
@Entity
@Table( name= "authorities")
public final class Authority implements GrantedAuthority {
    private static final long serialVersionUID = 320L;

    @Id
    @GeneratedValue
    private Integer id;

    @NotNull
    private String authority;

    @ManyToOne
    @JoinColumn(name="username")
    private User username;

    public Authority(String authority) {
        Assert.hasText(authority, "A granted authority textual representation is required");
        this.authority = authority;
    }

    public boolean equals(Object obj) {
        return this == obj?true:(obj instanceof Authority?this.authority.equals(((Authority)obj).authority):false);
    }

    public int hashCode() {
        return this.authority.hashCode();
    }

    public String toString() {
        return this.authority;
    }
}
