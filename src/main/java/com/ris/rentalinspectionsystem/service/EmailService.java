package com.ris.rentalinspectionsystem.service;

import com.ris.rentalinspectionsystem.model.Agent;
import com.ris.rentalinspectionsystem.model.Enquiry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class EmailService {

    private final JavaMailSender javaMailSender;

    @Autowired
    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendEnquiry(Agent agent, Enquiry enquiry) {

        String subject = "Enquiry for " + enquiry.getAddress();
        String text = String.format(
                "Dear %s %s,\n\nYou have a new enquiry regarding the property at %s.\n" +
                        "Topic: %s\nName: %s %s\nEmail: %s\nPhone Number: %s\n\n%s",
                agent.getFirstName(),
                agent.getLastName(),
                enquiry.getAddress(),
                enquiry.getTopic(),
                enquiry.getFirstName(),
                enquiry.getLastName(),
                enquiry.getEmail(),
                enquiry.getPhone(),
                enquiry.getMessage()

        );

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(agent.getEmail());
        message.setSubject(subject);
        message.setText(text);
        javaMailSender.send(message);
    }
}
