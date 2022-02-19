package com.ris.rentalinspectionsystem.repositories;

import com.ris.rentalinspectionsystem.model.Inspection;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InspectionRepository extends CrudRepository<Inspection, Long> {
    List<Inspection> findByEstateId(Long estateId);
}
