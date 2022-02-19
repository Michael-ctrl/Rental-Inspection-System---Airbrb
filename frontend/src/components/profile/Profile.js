import {
  Button,
  MenuItem,
  TextField,
  Typography,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import userContext from "../../lib/context";
import API from "../../services/api";
import useAPI from "../../services/useApi";
import { getUserId } from "../../lib/helper";
import { propertyTypes } from "../property/PropertyAdd";
import { SUBNAV_HEIGHT, NAVBAR_HEIGHT } from "../../const";

const propertyFilters = [
  {
    value: -1,
    label: "Any",
  },
  ...propertyTypes,
];

function Profile() {
  const { user } = useContext(userContext);
  const inspectorId = getUserId(user.token);
  const [options, setOptions] = useState(null);
  const optionNumbers = [-1, 1, 2, 3, 4, 5];
  const history = useHistory();

  const updateProfile = useCallback(() => {
    return API.updateUserProfile(inspectorId, {
      bedrooms: options.bedrooms === -1 ? null : options.bedrooms,
      bathrooms: options.bathrooms === -1 ? null : options.bathrooms,
      garages: options.garages === -1 ? null : options.garages,
      property_type:
        options.property_type === -1 ? null : options.property_type,
      land_sqm_min: options.land_sqm_min === -1 ? null : options.land_sqm_min,
      land_sqm_max: options.land_sqm_max === -1 ? null : options.land_sqm_max,
      price_min: options.price_min === -1 ? null : options.price_min,
      price_max: options.price_max === -1 ? null : options.price_max,
    });
  }, [inspectorId, options]);

  const [{ inProgress, error, data }, makeAPIRequest] = useAPI(updateProfile);

  useEffect(async () => {
    const userProfile = await API.getUserProfile(inspectorId);
    Object.keys(userProfile).map(function (key, index) {
      userProfile[key] = userProfile[key] === null ? -1 : userProfile[key];
    });
    setOptions({
      ...userProfile,
    });
  }, []);

  const updateOptions = useCallback(
    (field) => {
      setOptions({ ...options, ...field });
    },
    [options, setOptions]
  );

  useEffect(() => {
    if (!inProgress && !error && !!data) {
      history.push("/");
    }
  }, [inProgress, error, data, history]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: `calc(100vh) - ${NAVBAR_HEIGHT} - ${SUBNAV_HEIGHT}`,
        padding: "0 0 16px 0",
      }}
    >
      {!options && <CircularProgress />}
      {!!options && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            maxWidth: "400px",
          }}
        >
          <Typography variant="h3" sx={{ marginTop: "16px" }}>
            Property Preferences
          </Typography>
          <TextField
            select
            value={options.bedrooms || -1}
            label="Bedrooms"
            onChange={(e) =>
              updateOptions({ bedrooms: parseInt(e.target.value) })
            }
            sx={{
              marginTop: "16px",
            }}
          >
            {optionNumbers.map((o) => (
              <MenuItem key={`bedroom-options-${o}`} value={o}>
                {o === -1 && "Any"}
                {o === 1 && "1 Bedroom"}
                {o > 1 && o < 6 && `${o} Bedrooms`}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            value={options.bathrooms || -1}
            label="Bathrooms"
            onChange={(e) =>
              updateOptions({ bathrooms: parseInt(e.target.value) })
            }
            sx={{
              marginTop: "16px",
            }}
          >
            {optionNumbers.map((o) => (
              <MenuItem key={`bathrooms-options-${o}`} value={o}>
                {o === -1 && "Any"}
                {o === 1 && "1 Bathroom"}
                {o > 1 && o < 6 && `${o} Bathrooms`}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            value={options.garages || -1}
            label="Garages"
            onChange={(e) =>
              updateOptions({ garages: parseInt(e.target.value) })
            }
            sx={{
              marginTop: "16px",
            }}
          >
            {optionNumbers.map((o) => (
              <MenuItem key={`garages-options-${o}`} value={o}>
                {o === -1 && "Any"}
                {o === 1 && "1 Garage"}
                {o > 1 && o < 6 && `${o} Garages`}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            required
            select
            label="Property Type"
            value={options.property_type}
            // TODO: possible bug with parseint
            onChange={(e) => updateOptions({ property_type: e.target.value })}
            sx={{
              marginTop: "16px",
            }}
          >
            {propertyFilters.map((o) => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            required
            InputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            type="number"
            label="Min Price"
            helperText="per week"
            value={options.price_min}
            onChange={(e) =>
              updateOptions({ price_min: parseInt(e.target.value) })
            }
            sx={{
              marginTop: "16px",
            }}
          />
          <TextField
            required
            InputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            type="number"
            label="Max Price"
            helperText="per week"
            value={options.price_max}
            onChange={(e) =>
              updateOptions({ price_max: parseInt(e.target.value) })
            }
            sx={{
              marginTop: "16px",
            }}
          />
          <TextField
            required
            InputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              endAdornment: (
                <InputAdornment position="end">sq m</InputAdornment>
              ),
            }}
            type="number"
            label="Min Land"
            helperText=" "
            value={options.land_sqm_min}
            onChange={(e) =>
              updateOptions({ land_sqm_min: parseInt(e.target.value) })
            }
          />
          <TextField
            required
            InputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              endAdornment: (
                <InputAdornment position="end">sq m</InputAdornment>
              ),
            }}
            type="number"
            label="Max Land"
            helperText=" "
            value={options.land_sqm_max}
            onChange={(e) =>
              updateOptions({ land_sqm_max: parseInt(e.target.value) })
            }
          />
          <Button variant="outlined" onClick={makeAPIRequest}>
            Save
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default Profile;
