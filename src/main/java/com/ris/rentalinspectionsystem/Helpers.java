package com.ris.rentalinspectionsystem;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Objects;

public class Helpers {

    public static void verifyId(Long id) {
        Object idFromToken = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        if (!Objects.equals(id, idFromToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Id and token do not match");
        }
    }
}
