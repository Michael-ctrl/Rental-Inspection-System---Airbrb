package com.ris.rentalinspectionsystem.controller;

import com.ris.rentalinspectionsystem.Helpers;
import com.ris.rentalinspectionsystem.dao.EstateDao;
import com.ris.rentalinspectionsystem.dao.InspectorDao;
import com.ris.rentalinspectionsystem.model.Estate;
import com.ris.rentalinspectionsystem.model.Inspector;
import com.ris.rentalinspectionsystem.model.Login;
import com.ris.rentalinspectionsystem.model.Profile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.relational.core.conversion.DbActionExecutionException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/inspector")
public class InspectorController {

    private final InspectorDao inspectorDao;
    private final EstateDao estateDao;

    @Autowired
    public InspectorController(InspectorDao inspectorDao, EstateDao estateDao) {
        this.inspectorDao  = inspectorDao;
        this.estateDao = estateDao;
    }

    @GetMapping("")
    public List<Inspector> getInspectors() { return inspectorDao.getInspectors(); }

    @GetMapping("/{inspectorId}")
    public Inspector getInspector(
            @PathVariable("inspectorId") Long inspectorId
    ) {
        return inspectorDao.getInspector(inspectorId);
    }

    @GetMapping("/{inspectorId}/profile")
    public Profile getProfile(
            @PathVariable("inspectorId") Long inspectorId
    ) {
        Helpers.verifyId(inspectorId);
        return inspectorDao.getProfile(inspectorId);
    }

    @PatchMapping("/{inspectorId}/profile")
    public Profile patchProfile(
            @PathVariable("inspectorId") Long inspectorId,
            @Valid @RequestBody Profile profile
    ) {
        Helpers.verifyId(inspectorId);
        return inspectorDao.patchProfile(inspectorId, profile);
    }


    @PostMapping("")
    public Inspector createInspector(
            @Valid @RequestBody Inspector inspector
    ) {
        try {
            return inspectorDao.createInspector(inspector);
        } catch (DbActionExecutionException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @GetMapping("/{inspectorId}/estates/all")
    public List<Estate> getEstates(
            @PathVariable("inspectorId") Long inspectorId
    ) {
        Helpers.verifyId(inspectorId);
        Profile inspectorProfile = inspectorDao.getProfile(inspectorId);

        Map<String, Object> queryParams = new HashMap();
        queryParams.put("bedrooms", inspectorProfile.getBedrooms());
        queryParams.put("bathrooms", inspectorProfile.getBathrooms());
        queryParams.put("garages", inspectorProfile.getGarages());
        queryParams.put("property_type", inspectorProfile.getPropertyType());
        queryParams.put("land_sqm_min", inspectorProfile.getLandSqmMin());
        queryParams.put("land_sqm_max", inspectorProfile.getLandSqmMax());
        queryParams.put("price_min", inspectorProfile.getPriceMin());
        queryParams.put("price_max", inspectorProfile.getPriceMax());
        queryParams.put("open", true);

        List<Estate> estates = estateDao.getEstates(queryParams);
        estates.sort((e1, e2) -> e2.getViewed().compareTo(e1.getViewed()));
        return estates;
    }

    @PostMapping("/login")
    public String login(
            @Valid @RequestBody Login login
    ) {
        try {
            String token = inspectorDao.login(login);
            if (token == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "The username or password is incorrect"
                );
            }
            return token;
        } catch (DbActionExecutionException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
}
