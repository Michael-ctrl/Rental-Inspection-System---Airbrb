package com.ris.rentalinspectionsystem.repositories;

import com.ris.rentalinspectionsystem.model.Agent;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgentsRepository extends CrudRepository<Agent, Long> {
    Agent findByEmailAndPassword(String email, String password);
}