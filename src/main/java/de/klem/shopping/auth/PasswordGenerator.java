package de.klem.shopping.auth;

import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.security.SecureRandom;

/**
 * Created by Yannic on 05.04.2015.
 */
@Service
public class PasswordGenerator {
    private SecureRandom random = new SecureRandom();

    public String generatePassword() {
        return new BigInteger(130, random).toString(32);
    }
}
