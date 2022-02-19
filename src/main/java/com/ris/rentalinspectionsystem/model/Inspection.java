package com.ris.rentalinspectionsystem.model;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import java.sql.Timestamp;

@Data
@Table("inspections")
public class Inspection {

    @Id
    @Null
    private Long inspectionId;
    @Null
    private Long estateId;
    @NotNull
    private final Timestamp startDate;
    @NotNull
    private final Timestamp endDate;


    public Inspection(
            Long inspectionId,
            Long estateId,
            @JsonProperty("start_date") Long startDate,
            @JsonProperty("end_date") Long endDate
    ) {
        this.inspectionId = inspectionId;
        this.estateId = estateId;
        this.startDate = new Timestamp(startDate * 1000L);
        this.endDate = new Timestamp(endDate * 1000L);
    }
}
