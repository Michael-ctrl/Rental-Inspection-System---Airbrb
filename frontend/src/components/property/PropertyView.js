import React, { useContext, useState, useCallback, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import {
  Typography,
  Button,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import styled from "styled-components";
import PropertyCard from "./PropertyCard";
import { useHistory } from "react-router-dom";
import API from "../../services/api";
import userContext from "../../lib/context";
import useAPI from "../../services/useApi";
import { getUserId } from "../../lib/helper";

const PropertyViewContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;

  padding: 16px;
`;

function PropertyView() {
  const history = useHistory();
  const { user } = useContext(userContext);
  const agentId = getUserId(user.token);
  const [properties, setProperties] = useState([]);

  const fetchAllProperties = useCallback(() => {
    return API.getAllAgentProperties(agentId);
  }, [agentId]);

  const [{ inProgress, error, data }, makeAPIRequest] =
    useAPI(fetchAllProperties);

  useEffect(() => {
    if (!inProgress && !error && !data) {
      makeAPIRequest();
    }
  }, [inProgress, makeAPIRequest, data, error]);

  useEffect(() => {
    if (!inProgress && !error && !!data) {
      setProperties(data);
    }
  }, [inProgress, error, data]);

  const openProperties = properties.filter((p) => p.open);
  const closedProperties = properties.filter((p) => !p.open);

  return (
    <PropertyViewContainer>
      <Box sx={{ display: "flex" }}>
        <Typography variant="h4">Open Properties</Typography>
        <Button
          onClick={() => history.push("/property/add")}
          color="secondary"
          variant="outlined"
          sx={{
            marginLeft: "8px",
          }}
        >
          <AddIcon />
          Add
        </Button>
      </Box>
      <Divider sx={{ marginTop: "8px" }} />
      {inProgress && <CircularProgress />}
      {!openProperties.length && (
        <Typography variant="body1" marginTop={1}>
          No open properties
        </Typography>
      )}
      {openProperties.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
      <Typography variant="h4" sx={{ marginTop: "32px" }}>
        Closed Properties
      </Typography>
      <Divider sx={{ marginTop: "8px" }} />
      {inProgress && <CircularProgress />}
      {!closedProperties.length && (
        <Typography variant="body1" marginTop={1}>
          No closed properties
        </Typography>
      )}
      {closedProperties.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </PropertyViewContainer>
  );
}

export default PropertyView;
