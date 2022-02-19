package com.ris.rentalinspectionsystem.model;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class Login {

    @NotNull
    private final String username;
    @NotNull
    private final String password;

    public Login(
            String username,
            String password
    ) {
        this.username = username;
        this.password = password;
    }
}
