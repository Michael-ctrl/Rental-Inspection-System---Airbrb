package com.ris.rentalinspectionsystem.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import javax.validation.constraints.Null;

@Data
@Table("profiles")
public class Profile {

    @Id
    @Null
    private Long profileId;
    private final Long inspectorId;
    private final Integer bedrooms;
    private final Integer bathrooms;
    private final Integer garages;
    @JsonProperty("property_type") private final String propertyType;
    @JsonProperty("land_sqm_min") private final Integer landSqmMin;
    @JsonProperty("land_sqm_max") private final Integer landSqmMax;
    @JsonProperty("price_min") private final Integer priceMin;
    @JsonProperty("price_max") private final Integer priceMax;

    public Profile(
            Long profileId,
            Long inspectorId,
            Integer bedrooms,
            Integer bathrooms,
            Integer garages,
            String propertyType,
            Integer landSqmMin,
            Integer landSqmMax,
            Integer priceMin,
            Integer priceMax
    ) {
        this.profileId = profileId;
        this.inspectorId = inspectorId;
        this.bedrooms = bedrooms;
        this.bathrooms = bathrooms;
        this.garages = garages;
        this.propertyType = propertyType;
        this.landSqmMin = landSqmMin;
        this.landSqmMax = landSqmMax;
        this.priceMin = priceMin;
        this.priceMax = priceMax;
    }

}
