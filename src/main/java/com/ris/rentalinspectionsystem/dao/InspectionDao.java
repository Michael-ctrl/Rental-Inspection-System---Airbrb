package com.ris.rentalinspectionsystem.dao;


import com.ris.rentalinspectionsystem.model.Inspection;
import com.ris.rentalinspectionsystem.repositories.InspectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class InspectionDao {

    private final InspectionRepository inspectionRepository;

    @Autowired
    public InspectionDao(InspectionRepository inspectionRepository) {
        this.inspectionRepository = inspectionRepository;
    }

    public List<Inspection> getInspections(Long estateId) {
        return inspectionRepository.findByEstateId(estateId);
    }

    public Inspection createInspection(Long estateId, Inspection inspection) {
        inspection.setEstateId(estateId);
        return inspectionRepository.save(inspection);
    }

    public void deleteInspection(Long inspectionId) {
        inspectionRepository.deleteById(inspectionId);
    }
}
