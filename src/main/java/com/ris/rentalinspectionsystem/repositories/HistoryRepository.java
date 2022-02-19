package com.ris.rentalinspectionsystem.repositories;

import com.ris.rentalinspectionsystem.model.History;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoryRepository extends CrudRepository<History, Long> {
    List<History> findByInspectorId(Long inspectorId);
    History findByInspectorIdAndEstateId(Long inspectorId, Long estateId);
}
