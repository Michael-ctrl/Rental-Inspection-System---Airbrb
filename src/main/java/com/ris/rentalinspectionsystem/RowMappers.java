package com.ris.rentalinspectionsystem;

import com.ris.rentalinspectionsystem.model.Estate;
import com.ris.rentalinspectionsystem.model.Inspection;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

public class RowMappers {

    public static class EstateRowMapper implements ResultSetExtractor<List<Estate>> {

        @Override
        public List<Estate> extractData(ResultSet rs) throws SQLException, DataAccessException {

            Map<Long, Estate> estates = new HashMap<>();

            while (rs.next()) {
                Long id = rs.getLong("estate_id");

                Set<Inspection> inspections = new HashSet<>();
                // Retrieve inspections if it exists.
                if (rs.getLong("inspection_id") != 0) {
                    inspections.add(new InspectionRowMapper().mapRow(rs, rs.getRow()));
                }

                // Join with all previously extracted inspections.
                if (estates.containsKey(id)) {
                    inspections.addAll(estates.get(id).getInspections());
                }

                Estate estate = new Estate(
                        rs.getLong("estate_id"),
                        rs.getLong("agent_id"),
                        rs.getString("title"),
                        rs.getString("description"),
                        rs.getString("property_type"),
                        rs.getString("address"),
                        rs.getInt("bedrooms"),
                        rs.getInt("bathrooms"),
                        rs.getInt("garages"),
                        rs.getInt("land_sqm"),
                        rs.getInt("price"),
                        rs.getString("images"),
                        inspections,
                        rs.getBoolean("open"),
                        rs.getInt("viewed")
                );

                estates.put(id, estate);
            }

            return new ArrayList<>(estates.values());
        }
    }

    public static class InspectionRowMapper implements RowMapper<Inspection> {
        @Override
        public Inspection mapRow(ResultSet resultSet, int i) throws SQLException {
            return new Inspection(
                    resultSet.getLong("inspection_id"),
                    resultSet.getLong("estate_id"),
                    resultSet.getTimestamp("start_date").getTime() / 1000L,
                    resultSet.getTimestamp("end_date").getTime() / 1000L
            );
        }
    }
}
