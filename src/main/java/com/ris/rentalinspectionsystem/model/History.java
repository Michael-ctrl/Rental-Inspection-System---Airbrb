package com.ris.rentalinspectionsystem.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import java.sql.Timestamp;

@Data
@Table("history")
public class History {

    @Id
    @Null
    private final Long historyId;
    @NotNull
    private final Long inspectorId;
    @NotNull
    private final Long estateId;
    @Null // maybe?? not sure how current timestamp works
    private final Timestamp viewDate; // Do I even include this??!

    public History(
            Long historyId,
            @JsonProperty("inspector_id") Long inspectorId,
            @JsonProperty("estate_id") Long estateId,
            @JsonProperty("view_date") Timestamp viewDate
    ) {
        this.historyId = historyId;
        this.inspectorId = inspectorId;
        this.estateId = estateId;
        this.viewDate = viewDate;
    }
}
