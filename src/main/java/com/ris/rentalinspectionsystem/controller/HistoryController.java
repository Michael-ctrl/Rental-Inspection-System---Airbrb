package com.ris.rentalinspectionsystem.controller;

import com.ris.rentalinspectionsystem.Helpers;
import com.ris.rentalinspectionsystem.dao.EstateDao;
import com.ris.rentalinspectionsystem.dao.HistoryDao;
import com.ris.rentalinspectionsystem.model.Estate;
import com.ris.rentalinspectionsystem.model.History;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/inspector/{inspectorId}")
public class HistoryController {
    private final HistoryDao historyDao;
    private final EstateDao estateDao;

    @Autowired
    public HistoryController(HistoryDao historyDao, EstateDao estateDao) {
        this.historyDao = historyDao;
        this.estateDao = estateDao;
    }

    @GetMapping("/history")
    public List<History> getHistory(
            @PathVariable("inspectorId") Long inspectorId
    ) {
        Helpers.verifyId(inspectorId);
        return historyDao.getHistory(inspectorId);
    }

    @GetMapping("/estates/{estateId}")
    public Estate getEstate(
            @PathVariable("inspectorId") Long inspectorId,
            @PathVariable("estateId") Long estateId
    ) {
        Helpers.verifyId(inspectorId);
        historyDao.createHistory(inspectorId, estateId);
        estateDao.addView(estateId);
        return estateDao.getEstate(estateId);
    }
}
