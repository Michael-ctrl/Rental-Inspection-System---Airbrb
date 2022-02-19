import React, { useCallback, useContext, useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import API from "../../services/api";
import userContext from "../../lib/context";
import { useParams, useHistory, Redirect } from "react-router-dom";
import useAPI from "../../services/useApi";
import { propertyTypes } from "./PropertyAdd";
import { usePlacesWidget } from "react-google-autocomplete";
import { getUserId } from "../../lib/helper";

function PropertyEdit() {
  const { estateId } = useParams();
  const history = useHistory();
  const { user } = useContext(userContext);
  const agentId = getUserId(user.token);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState("");
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [garages, setGarages] = useState(0);
  const [landSqm, setLandSqm] = useState(0);
  const [price, setPrice] = useState(0);

  const { ref } = usePlacesWidget({
    apiKey: API.getMapsKey(),
    onPlaceSelected: (place) => setAddress(place.formatted_address),
    options: {
      types: ["address"],
    },
  });

  const fetchProperty = useCallback(async () => {
    return API.getProperty(agentId, estateId);
  }, [agentId, estateId]);

  const updateProperty = useCallback(async () => {
    // TODO: Add some data validation
    const result = await API.editProperty(agentId, estateId, {
      title,
      description,
      address,
      property_type: type,
      bedrooms,
      bathrooms,
      garages,
      land_sqm: landSqm,
      price,
    });
    history.push(`/property/${estateId}`);
    return result;
  }, [
    title,
    description,
    address,
    type,
    bedrooms,
    bathrooms,
    garages,
    landSqm,
    price,
    estateId,
    agentId,
    history,
  ]);

  const [{ inProgress, error, data }, makeAPIRequest] = useAPI(updateProperty);

  useEffect(() => {
    const init = async () => {
      const fetchedProperty = await fetchProperty();
      setTitle(fetchedProperty.title);
      setDescription(fetchedProperty.description);
      setAddress(fetchedProperty.address);
      setType(fetchedProperty.property_type);
      setBedrooms(fetchedProperty.bedrooms);
      setBathrooms(fetchedProperty.bathrooms);
      setGarages(fetchedProperty.garages);
      setLandSqm(fetchedProperty.land_sqm);
      setPrice(fetchedProperty.price);
    };
    init();
  }, [fetchProperty]);

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        "> div:not(:first-of-type)": {
          marginTop: "16px",
        },
      }}
    >
      <TextField
        required
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        multiline
        rows={4}
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <TextField
        inputRef={ref}
        required
        label="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <TextField
        required
        select
        label="Property Type"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        {propertyTypes.map((o) => (
          <MenuItem key={o.value} value={o.value}>
            {o.label}
          </MenuItem>
        ))}
      </TextField>
      <Box
        sx={{
          "> div:not(:first-of-type)": {
            marginLeft: "16px",
          },
        }}
      >
        <TextField
          InputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
          }}
          type="number"
          label="Bedrooms"
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
        />
        <TextField
          InputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
          }}
          type="number"
          label="Bathrooms"
          value={bathrooms}
          onChange={(e) => setBathrooms(e.target.value)}
        />
        <TextField
          InputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
          }}
          type="number"
          label="Garages"
          value={garages}
          onChange={(e) => setGarages(e.target.value)}
        />
      </Box>
      <Box
        sx={{
          "> div:not(:first-of-type)": {
            marginLeft: "16px",
          },
        }}
      >
        <TextField
          InputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          type="number"
          label="Price"
          helperText="per week"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <TextField
          InputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
            endAdornment: <InputAdornment position="end">sq m</InputAdornment>,
          }}
          type="number"
          label="Land"
          helperText=" "
          value={landSqm}
          onChange={(e) => setLandSqm(e.target.value)}
        />
      </Box>
      <Box sx={{ marginTop: "24px" }}>
        <Button color="secondary" variant="outlined" onClick={makeAPIRequest}>
          {!inProgress ? "Save" : <CircularProgress size={20} />}
        </Button>
        <Button
          color="secondary"
          onClick={() => history.push(`/property/${estateId}`)}
          sx={{
            marginLeft: "8px",
          }}
        >
          Cancel
        </Button>
      </Box>
      {!!error && <Box sx={{ color: "error.main" }}>{error}</Box>}
      {!inProgress && !error && !!data && (
        <Redirect to={`property/${estateId}`} />
      )}
    </Box>
  );
}

export default PropertyEdit;
