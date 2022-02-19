import { CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import API from "../../services/api";
import useAPI from "../../services/useApi";
import PropertyCard from "./PropertyCard";
import userContext from "../../lib/context";
import { getUserId } from "../../lib/helper";

function PropertyViewInspector() {
  const [properties, setProperties] = useState(null);
  const { user } = useContext(userContext);
  const inspectorId = getUserId(user.token);

  const fetchAllProperties = () => {
    return API.getAllInspectorProperties(inspectorId);
  };

  const [{ inProgress, error, data }, makeAPIRequest] =
    useAPI(fetchAllProperties);

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
    <Box padding={2}>
      {inProgress && <CircularProgress />}
      {!inProgress && !!properties && (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="h3" mt={2}>
            Properties selected for you
          </Typography>
          {properties.length === 0 && (
            <Typography mt={2}>
              No properties at this moment, please check back later.
            </Typography>
          )}
          {properties.map((p) => (
            <PropertyCard key={`property-${p.id}`} property={p} />
          ))}
        </Box>
      )}
      {!!error && <Box sx={{ color: "error.main" }}>{error}</Box>}
    </Box>
  );
}

export default PropertyViewInspector;
