package de.klem.shopping.config;

import de.klem.shopping.auth.PasswordGenerator;
import javafx.application.Application;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.WebUtils;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Yannic on 03.04.2015.
 */
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter{
    @Autowired
    private DataSource datasource;

    @Autowired
    private PasswordGenerator passwordGenerator;

    private Logger logger = Logger.getLogger(Application.class.getName());

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .httpBasic()
                .and()
                .authorizeRequests()
                .antMatchers(HttpMethod.GET, "/api/user").permitAll()
                .antMatchers("/img/**", "/lib/**", "/style/**", "/**/**.html", "/**/**.js", "/**/**.css", "/", "/authorize").permitAll()
                .anyRequest().authenticated()
                .and()
                .logout().logoutSuccessUrl("/#logout").deleteCookies("JSESSIONID", "XSRF-TOKEN")
                .and()
                .csrf().csrfTokenRepository(csrfTokenRepository())
                .and()
                .addFilterAfter(csrfHeaderFilter(), CsrfFilter.class);
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        JdbcUserDetailsManager userDetailsManager = new JdbcUserDetailsManager();
        userDetailsManager.setDataSource(datasource);
        PasswordEncoder encoder =new BCryptPasswordEncoder();

        auth.userDetailsService(userDetailsManager).passwordEncoder(encoder);
        auth.jdbcAuthentication().dataSource(datasource);

        if(userDetailsManager.userExists("admin")) {
            userDetailsManager.deleteUser("admin");
        }

        createDefaultAdmin(userDetailsManager, encoder);
    }

    private void createDefaultAdmin(JdbcUserDetailsManager userDetailsManager, PasswordEncoder encoder) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ADMIN"));
        String password = passwordGenerator.generatePassword();
        logger.info("\n\nCreated initial admin password: \"" + password + "\"\n");
        User userDetails = new User("admin", encoder.encode(password), authorities);

        userDetailsManager.createUser(userDetails);
    }

    private Filter csrfHeaderFilter() {
        return new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(HttpServletRequest request,
                                            HttpServletResponse response, FilterChain filterChain)
                    throws ServletException, IOException {
                CsrfToken csrf = (CsrfToken) request.getAttribute(CsrfToken.class
                        .getName());
                if (csrf != null) {
                    Cookie cookie = WebUtils.getCookie(request, "XSRF-TOKEN");
                    String token = csrf.getToken();
                    if (cookie == null || token != null
                            && !token.equals(cookie.getValue())) {
                        cookie = new Cookie("XSRF-TOKEN", token);
                        cookie.setPath("/");
                        response.addCookie(cookie);
                    }
                }
                filterChain.doFilter(request, response);
            }
        };
    }

    private CsrfTokenRepository csrfTokenRepository() {
        HttpSessionCsrfTokenRepository repository = new HttpSessionCsrfTokenRepository();
        repository.setHeaderName("X-XSRF-TOKEN");
        return repository;
    }
}
