package com.ris.rentalinspectionsystem.repositories;

import com.ris.rentalinspectionsystem.model.Estate;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EstatesRepository extends CrudRepository<Estate, Long> {
}
