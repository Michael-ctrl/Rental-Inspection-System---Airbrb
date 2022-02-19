package com.ris.rentalinspectionsystem.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class Enquiry {

    @NotNull
    private final Topic topic;
    @NotNull
    private final String address;
    @NotNull
    private final String message;
    @NotNull
    @JsonProperty("first_name")
    private final String firstName;
    @NotNull
    @JsonProperty("last_name")
    private final String lastName;
    @NotNull
    private final String email;
    private final String phone;

    public Enquiry(
            String topic,
            String address,
            String message,
            String firstName,
            String lastName,
            String email,
            String phone
    ) {
        this.topic = Topic.fromString(topic);
        this.address = address;
        this.message = message;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
    }
}