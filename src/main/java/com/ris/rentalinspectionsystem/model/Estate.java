package com.ris.rentalinspectionsystem.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Table;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import java.util.Set;

@Data
@Table("estates")
public class Estate {

    @Id
    @Null
    private Long estateId;
    @Null
    private Long agentId;
    @NotNull
    private final String title;
    @NotNull
    private final String description;
    @NotNull
    private final String propertyType;
    @NotNull
    private final String address;
    @NotNull
    private final Integer bedrooms;
    @NotNull
    private final Integer bathrooms;
    @NotNull
    private final Integer garages;
    @NotNull
    private final Integer landSqm;
    @NotNull
    private final Integer price;
    private final String images;
    @Null
    @Transient
    private final Set<Inspection> inspections;
    @NotNull
    private final Boolean open;
    @Null
    private Integer viewed;

    @JsonCreator
    public Estate(
            @JsonProperty("id") Long estateId,
            @JsonProperty("agent_id") Long agentId,
            @JsonProperty("title") String title,
            @JsonProperty("description") String description,
            @JsonProperty("property_type") String propertyType,
            @JsonProperty("address") String address,
            @JsonProperty("bedrooms") Integer bedrooms,
            @JsonProperty("bathrooms") Integer bathrooms,
            @JsonProperty("garages") Integer garages,
            @JsonProperty("land_sqm") Integer landSqm,
            @JsonProperty("price") Integer price,
            @JsonProperty("images") String images,
            @JsonProperty("inspection_dates") Set<Inspection> inspections,
            @JsonProperty("open") Boolean open,
            @JsonProperty("viewed") Integer viewed
    ) {
        this.estateId = estateId;
        this.agentId = agentId;
        this.title = title;
        this.description = description;
        this.propertyType = propertyType;
        this.address = address;
        this.bedrooms = bedrooms;
        this.bathrooms = bathrooms;
        this.garages = garages;
        this.landSqm = landSqm;
        this.price = price;
        this.images = images;
        this.inspections = inspections;
        this.open = open;
        this.viewed = viewed;
    }
    public void setViewed(int count) {
        this.viewed = count;
    }
}