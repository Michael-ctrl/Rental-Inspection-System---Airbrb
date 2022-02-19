import React, { useContext, useState, useCallback } from "react";
import { useHistory, Redirect } from "react-router-dom";
import userContext from "../../lib/context";
import API from "../../services/api";
import useAPI from "../../services/useApi";
import {
  Box,
  TextField,
  CircularProgress,
  MenuItem,
  InputAdornment,
  Button,
} from "@mui/material";
import { usePlacesWidget } from "react-google-autocomplete";
import { getUserId } from "../../lib/helper";

export const propertyTypes = [
  {
    value: "house",
    label: "House",
  },
  {
    value: "terrace",
    label: "Terrace",
  },
  {
    value: "duplex",
    label: "Duplex",
  },
  {
    value: "townhouse",
    label: "Townhouse",
  },
  {
    value: "apartment",
    label: "Apartment",
  },
];

function PropertyAdd() {
  const history = useHistory();
  const { user } = useContext(userContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [address, setAddress] = useState("");
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

  const addProperty = useCallback(() => {
    return API.addProperty(getUserId(user.token), {
      title,
      description,
      property_type: type,
      address,
      bedrooms,
      bathrooms,
      garages,
      land_sqm: landSqm,
      price,
    });
  }, [
    user,
    title,
    description,
    type,
    address,
    bedrooms,
    bathrooms,
    garages,
    landSqm,
    price,
  ]);

  const [{ inProgress, error, data }, makeAPIRequest] = useAPI(addProperty);

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
          required
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
          required
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
          {!inProgress ? "Add" : <CircularProgress size={20} />}
        </Button>
        <Button
          color="secondary"
          onClick={() => history.push(`/`)}
          sx={{
            marginLeft: "8px",
          }}
        >
          Cancel
        </Button>
      </Box>
      {!!error && <Box sx={{ color: "error.main" }}>{error}</Box>}
      {/* Redirect once complete */}
      {!inProgress && !!data && <Redirect to="/" />}
    </Box>
  );
}

export default PropertyAdd;
