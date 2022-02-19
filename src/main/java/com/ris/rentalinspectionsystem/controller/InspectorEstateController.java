package com.ris.rentalinspectionsystem.controller;

import com.ris.rentalinspectionsystem.dao.EstateDao;
import com.ris.rentalinspectionsystem.model.Estate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/estates")
public class InspectorEstateController {
    private final EstateDao estateDao;

    @Autowired
    public InspectorEstateController(EstateDao estateDao) { this.estateDao = estateDao; }

    @GetMapping("/all")
    public List<Estate> getEstates(
            @RequestParam(required = false) Integer bedrooms,
            @RequestParam(required = false) Integer bathrooms,
            @RequestParam(required = false) Integer garages,
            @RequestParam(required = false) String propertyType,
            @RequestParam(required = false) Integer landSqmMin,
            @RequestParam(required = false) Integer landSqmMax,
            @RequestParam(required = false) Integer priceMin,
            @RequestParam(required = false) Integer priceMax,
            @RequestParam(required = false) Boolean open
    ) {
        Map<String, Object> queryParams = new HashMap();
        queryParams.put("bedrooms", bedrooms);
        queryParams.put("bathrooms", bathrooms);
        queryParams.put("garages", garages);
        queryParams.put("property_type", propertyType);
        queryParams.put("land_sqm_min", landSqmMin);
        queryParams.put("land_sqm_max", landSqmMax);
        queryParams.put("price_min", priceMin);
        queryParams.put("price_max", priceMax);
        queryParams.put("open", open);

        queryParams.values().removeAll(Collections.singleton(null));
        List<Estate> estateList = estateDao.getEstates(queryParams);
        Collections.sort(estateList, (e1, e2) -> e2.getViewed().compareTo(e1.getViewed()));
        return estateList;
    }

    @GetMapping("/{estateId}")
    public Estate getEstate(@PathVariable("estateId") Long estateId) {
        estateDao.addView(estateId);
        return estateDao.getEstate(estateId);
    }
}
