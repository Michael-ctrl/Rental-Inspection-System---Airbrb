import { CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { format } from "date-fns";
import React, { useCallback, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import userContext from "../../lib/context";
import API from "../../services/api";
import useAPI from "../../services/useApi";
import PropertyCard from "./PropertyCard";
import { getUserId } from "../../lib/helper";

const PropertyViewContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;

  padding: 16px;
`;

function PropertyHistory() {
  const { user } = useContext(userContext);
  const inspectorId = getUserId(user.token);
  const [properties, setProperties] = useState([]);

  const fetchHistory = useCallback(async () => {
    const historyIds = await API.getHistory(inspectorId);
    const pastProperties = [];
    for (const historyId of historyIds) {
      const property = await API.getPropertyPublic(historyId.estate_id);
      pastProperties.push({ ...property, viewDate: historyId.view_date });
    }
    return pastProperties;
  }, [inspectorId]);

  const [{ inProgress, error, data }, makeAPIRequest] = useAPI(fetchHistory);

  useEffect(() => {
    if (!inProgress && !error && !data) {
      makeAPIRequest();
    }
  }, [inProgress, error, data, makeAPIRequest]);

  useEffect(() => {
    if (!inProgress && !error && !!data) {
      setProperties(data);
    }
  }, [inProgress, error, data]);

  return (
    <PropertyViewContainer>
      {inProgress && <CircularProgress />}
      <Typography variant="h3">History</Typography>
      {properties.map((p) => (
        <Box key={`property-inspector-${p.id}`}>
          <PropertyCard key={p.id} property={p} />
          <Typography variant="subtitle2" mt={1}>{`viewed at ${format(
            new Date(p.viewDate),
            "Pp"
          )}`}</Typography>
        </Box>
      ))}
    </PropertyViewContainer>
  );
}

export default PropertyHistory;
