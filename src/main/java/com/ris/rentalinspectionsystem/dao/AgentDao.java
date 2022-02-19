package com.ris.rentalinspectionsystem.dao;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.algorithms.Algorithm;
import com.ris.rentalinspectionsystem.model.Agent;
import com.ris.rentalinspectionsystem.model.Login;
import com.ris.rentalinspectionsystem.repositories.AgentsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AgentDao {

    private final AgentsRepository agentsRepository;

    @Autowired
    public AgentDao(AgentsRepository agentsRepository) {
        this.agentsRepository = agentsRepository;
    }

    public List<Agent> getAgents() {
        return (List<Agent>) agentsRepository.findAll();
    }

    public Agent getAgent(Long id) {
        return agentsRepository.findById(id).orElse(null);
    }

    public Agent createAgent(Agent agent) {
        return agentsRepository.save(agent);
    }

    public Agent putAgent(Long agentId, Agent agent) {
        agent.setAgentId(agentId);
        return agentsRepository.save(agent);
    }

    public String login(Login login) {

        Agent agent = agentsRepository.findByEmailAndPassword(login.getUsername(), login.getPassword());

        JWTCreator.Builder jwtBuilder = JWT.create().withClaim("id", agent.getAgentId());
        return jwtBuilder.sign(Algorithm.HMAC256("rental-inspection-system"));

    }
}
