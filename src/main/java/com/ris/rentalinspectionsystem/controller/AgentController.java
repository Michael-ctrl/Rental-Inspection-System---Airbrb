package com.ris.rentalinspectionsystem.controller;

import com.ris.rentalinspectionsystem.dao.AgentDao;
import com.ris.rentalinspectionsystem.model.Agent;
import com.ris.rentalinspectionsystem.model.Enquiry;
import com.ris.rentalinspectionsystem.model.Login;
import com.ris.rentalinspectionsystem.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.relational.core.conversion.DbActionExecutionException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/agent")
public class AgentController {

    private final AgentDao agentDao;
    private final EmailService emailService;

    @Autowired
    public AgentController(AgentDao agentDao, EmailService emailService) {
        this.agentDao = agentDao;
        this.emailService = emailService;
    }

    @GetMapping("")
    public List<Agent> getAgents() {
        return agentDao.getAgents();
    }

    @GetMapping("/{agentId}")
    public Agent getAgent(
            @PathVariable("agentId") Long agentId
    ) {
        return agentDao.getAgent(agentId);
    }

    @PostMapping("")
    public Agent createAgent(
            @Valid @RequestBody Agent agent
    ) {
        try {
            return agentDao.createAgent(agent);
        } catch (DbActionExecutionException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PutMapping("/{agentId}")
    public Agent updateAgent(
            @PathVariable Long agentId,
            @Valid @RequestBody Agent agent
    ) {
        try {
            return agentDao.putAgent(agentId, agent);
        } catch (DbActionExecutionException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PostMapping("/login")
    public String login(
            @Valid @RequestBody Login login
    ) {
        try {
            return agentDao.login(login);
        } catch (DbActionExecutionException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PostMapping("/{agentId}/enquiries")
    public Enquiry contactAgent(
            @PathVariable Long agentId,
            @Valid @RequestBody Enquiry enquiry
    ) {
        Agent agent = agentDao.getAgent(agentId);
        emailService.sendEnquiry(agent, enquiry);

        return enquiry;
    }
}
