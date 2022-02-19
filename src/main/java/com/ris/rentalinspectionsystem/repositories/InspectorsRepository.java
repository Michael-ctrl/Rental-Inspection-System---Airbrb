package com.ris.rentalinspectionsystem.repositories;

import com.ris.rentalinspectionsystem.model.Inspector;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InspectorsRepository extends CrudRepository<Inspector, Long> {
    List<Inspector> findByEmailAndPassword(String email, String password);
}
