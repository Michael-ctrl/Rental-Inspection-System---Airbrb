package com.ris.rentalinspectionsystem.dao;

import com.ris.rentalinspectionsystem.RowMappers;
import com.ris.rentalinspectionsystem.model.Estate;
import com.ris.rentalinspectionsystem.repositories.EstatesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class EstateDao {

    private final EstatesRepository estatesRepository;
    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    private final RowMappers.EstateRowMapper estateRowMapper;

    @Autowired
    public EstateDao(
            EstatesRepository estatesRepository,
            NamedParameterJdbcTemplate namedParameterJdbcTemplate
    ) {
        this.estatesRepository = estatesRepository;
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
        this.estateRowMapper = new RowMappers.EstateRowMapper();
    }

    public List<Estate> getEstates(Map<String, Object> queryParams) {
        List<String> queryArgs = new ArrayList<>();

        for (Map.Entry<String, Object> queryParam : queryParams.entrySet()) {
            if (queryParam.getValue() == null) continue;
            switch (queryParam.getKey()) {
                case "land_sqm_min":
                    queryArgs.add(String.format("%s >= :%s", "land_sqm", queryParam.getKey()));
                    break;
                case "land_sqm_max":
                    queryArgs.add(String.format("%s <= :%s", "land_sqm", queryParam.getKey()));
                    break;
                case "price_min":
                    queryArgs.add(String.format("%s >= :%s", "price", queryParam.getKey()));
                    break;
                case "price_max":
                    queryArgs.add(String.format("%s <= :%s", "price", queryParam.getKey()));
                    break;
                default:
                    queryArgs.add(String.format("%s = :%s", queryParam.getKey(), queryParam.getKey()));
                    break;
            }
        }

        String filter = queryParams.isEmpty() ? "" : "WHERE " + String.join(" AND ", queryArgs);
        SqlParameterSource sqlParameterSource = new MapSqlParameterSource(queryParams);

        return namedParameterJdbcTemplate.query(
                "SELECT * FROM estates as e LEFT JOIN inspections i on e.estate_id = i.estate_id " + filter,
                sqlParameterSource,
                estateRowMapper
        );
    }

    public Estate getEstate(Long estateId) {
        List<Estate> estates = getEstates(new HashMap());
        return estates
                .stream()
                .filter(estate -> Objects.equals(estate.getEstateId(), estateId))
                .findFirst()
                .orElse(null);
    }

    public Estate createEstate(Long agentId, Estate estate) {
        estate.setAgentId(agentId);
        estate.setViewed(0);
        return estatesRepository.save(estate);
    }

    public Estate patchEstate(Long agentId, Long estateId, Estate estate) {
        Estate originalEstate = getEstate(estateId);

        Estate newEstate = new Estate(
                estateId,
                agentId,
                estate.getTitle() == null ? originalEstate.getTitle() : estate.getTitle(),
                estate.getDescription() == null ? originalEstate.getDescription() : estate.getDescription(),
                estate.getPropertyType() == null ? originalEstate.getPropertyType() : estate.getPropertyType(),
                estate.getAddress() == null ? originalEstate.getAddress() : estate.getAddress(),
                estate.getBedrooms() == null ? originalEstate.getBedrooms() : estate.getBedrooms(),
                estate.getBathrooms() == null ? originalEstate.getBathrooms() : estate.getBathrooms(),
                estate.getGarages() == null ? originalEstate.getGarages() : estate.getGarages(),
                estate.getLandSqm() == null ? originalEstate.getLandSqm(): estate.getLandSqm(),
                estate.getPrice() == null ? originalEstate.getPrice() : estate.getPrice(),
                estate.getImages() == null ? originalEstate.getImages() : estate.getImages(),
                estate.getInspections() == null ? originalEstate.getInspections() : estate.getInspections(),
                estate.getOpen() == null ? originalEstate.getOpen() : estate.getOpen(),
                estate.getViewed() == null ? originalEstate.getViewed() : 0
        );

        return estatesRepository.save(newEstate);
    }

    public Estate putEstate(Long agentId, Long estateId, Estate estate) {
        estate.setAgentId(agentId);
        estate.setEstateId(estateId);
        return estatesRepository.save(estate);
    }

    public void addView(Long estateId) {
        Estate prev = getEstate(estateId);
        if (prev != null) {
            prev.setViewed((prev.getViewed() + 1));
            estatesRepository.save(prev);
        }
    }
}