package com.ris.rentalinspectionsystem;

import com.ris.rentalinspectionsystem.model.Inspection;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jdbc.repository.QueryMappingConfiguration;
import org.springframework.data.jdbc.repository.config.DefaultQueryMappingConfiguration;

@Configuration
public class RepositoryConfig {

    @Bean
    QueryMappingConfiguration rowMappers() {
        return new DefaultQueryMappingConfiguration()
                .registerRowMapper(Inspection.class, new RowMappers.InspectionRowMapper());
    }
}
