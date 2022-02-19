package com.ris.rentalinspectionsystem;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import java.util.List;

public class AuthenticationFilter extends BasicAuthenticationFilter {

    // Entries are regex expressions.
    List<String> authenticationInclusions = List.of("/api/agent/.*/estates.*", "/api/inspector/.+/.*");

    public AuthenticationFilter(AuthenticationManager authenticationManager) {
        super(authenticationManager);
    }

    @Override
    public void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {

        for (String authenticationInclusion : authenticationInclusions) {
            if (request.getRequestURI().matches(authenticationInclusion)) {

                String header = request.getHeader("Authorization");
                if (header == null) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No auth token found");
                }
                String token = header.substring(7);
                // Verify the jwt token
                JWT.require(Algorithm.HMAC256("rental-inspection-system"))
                        .build()
                        .verify(token);

                DecodedJWT jwt = JWT.decode(token);
                Long id = jwt.getClaim("id").asLong();


                SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                        id,
                        jwt,
                        Collections.emptyList()
                ));

                chain.doFilter(request, response);

                return;
            }
        }

        chain.doFilter(request, response);
    }
}
