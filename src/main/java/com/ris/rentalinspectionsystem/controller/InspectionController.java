package com.ris.rentalinspectionsystem.controller;


import com.ris.rentalinspectionsystem.Helpers;
import com.ris.rentalinspectionsystem.dao.InspectionDao;
import com.ris.rentalinspectionsystem.model.Inspection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/agent/{agentId}/estates/{estateId}/inspections")
public class InspectionController {

    private final InspectionDao inspectionDao;

    @Autowired
    public InspectionController(InspectionDao inspectionDao) {
        this.inspectionDao = inspectionDao;
    }

    @GetMapping
    public List<Inspection> getInspection(
            @PathVariable("agentId") Long agentId,
            @PathVariable("estateId") Long estateId
    ) {
        Helpers.verifyId(agentId);
        return inspectionDao.getInspections(estateId);
    }

    @PostMapping
    public Inspection createInspection(
            @PathVariable("agentId") Long agentId,
            @PathVariable("estateId") Long estateId,
            @Valid @RequestBody Inspection inspection
    ) {
        Helpers.verifyId(agentId);
        return inspectionDao.createInspection(estateId, inspection);
    }

    @DeleteMapping("/{inspectionId}")
    public void deleteInspection(
            @PathVariable("agentId") Long agentId,
            @PathVariable("inspectionId") Long inspectionId
    ) {
        Helpers.verifyId(agentId);
        inspectionDao.deleteInspection(inspectionId);
    }
}
