import React, { useCallback, useContext, useEffect, useState } from "react";
import useAPI from "../../services/useApi";
import { useParams, useHistory } from "react-router-dom";
import API from "../../services/api";
import userContext from "../../lib/context";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import {
  Box,
  CardMedia,
  Typography,
  Grid,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import Contact from "../contact/Contact";
import { PropertyFeaturesComponent } from "./PropertyCard";
import HousePlaceholder from "../../assets/house-placeholder.jpg";
import HouseLivingRoomPlaceholder from "../../assets/house-living-room-placeholder.jpg";
import HouseKitchenPlaceholder from "../../assets/house-kitchen-placeholder.jpg";
import HouseBathroomPlaceholder from "../../assets/house-bathroom-placeholder.jpg";
import HouseBackyardPlaceholder from "../../assets/house-backyard-placeholder.jpg";
import { format } from "date-fns";
import { ROLE_MANAGER } from "../../const";
import { getUserId } from "../../lib/helper";

function PropertyDetails() {
  const { estateId } = useParams();
  const history = useHistory();
  const { user } = useContext(userContext);
  const [property, setProperty] = useState(null);
  const [open, setOpen] = useState(false);
  const userId = getUserId(user.token);

  const fetchProperty = useCallback(async () => {
    const property = await (!!user.token
      ? user.role === ROLE_MANAGER
        ? API.getProperty(userId, estateId)
        : API.getInspectorProperty(userId, estateId)
      : API.getPropertyPublic(estateId));
    const agent = await API.getUser(property.agent_id);
    return {
      property,
      agent,
    };
  }, [user, userId, estateId]);

  const [{ inProgress, error, data }, makeAPIRequest] = useAPI(fetchProperty);

  useEffect(() => {
    if (!inProgress && !error && !data) {
      makeAPIRequest();
    }
  }, [makeAPIRequest, inProgress, data, error]);

  useEffect(() => {
    if (!inProgress && !error && !!data) {
      setProperty({ ...data.property, agent: data.agent });
    }
  }, [inProgress, error, data]);

  const closeProperty = useCallback(async () => {
    await API.closeProperty(userId, estateId);
    makeAPIRequest();
  }, [userId, estateId, makeAPIRequest]);

  const openProperty = useCallback(async () => {
    await API.openProperty(userId, estateId);
    makeAPIRequest();
  }, [userId, estateId, makeAPIRequest]);

  const removeInspectionTimes = useCallback(
    async (inspectionId) => {
      await API.removeInspectionTimes(userId, estateId, inspectionId);
      makeAPIRequest();
    },
    [userId, estateId, makeAPIRequest]
  );

  const isCreator =
    user.role === ROLE_MANAGER && parseInt(userId) === property?.agent_id;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", padding: "32px" }}>
      {inProgress && <CircularProgress />}
      {!inProgress && !!property && (
        <Grid container>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Grid container>
              <Grid item xs={12} sx={{ my: 2, mx: 1 }}>
                <CardMedia
                  component="img"
                  sx={{ width: "100%", height: "100%" }}
                  image={property.images || HousePlaceholder}
                  alt="House Pic"
                />
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", flexDirection: "row", my: 1 }}
              >
                <Grid container spacing={1}>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      my: 1,
                      mr: 1,
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{ width: "100%", height: "50%", mb: 0.5 }}
                      image={property.images || HouseLivingRoomPlaceholder}
                      alt="Living Room Pic"
                    />
                    <CardMedia
                      component="img"
                      sx={{ width: "100%", height: "50%", mt: 0.5 }}
                      image={property.images || HouseKitchenPlaceholder}
                      alt="Kitchen Pic"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid
                    item
                    xs={12}
                    sx={{ display: "flex", flexDirection: "column", my: 1 }}
                  >
                    <CardMedia
                      component="img"
                      sx={{ width: "100%", height: "50%", mb: 0.5 }}
                      image={property.images || HouseBathroomPlaceholder}
                      alt="Bathroom Pic"
                    />
                    <CardMedia
                      component="img"
                      sx={{ width: "100%", height: "50%", mt: 0.5 }}
                      image={property.images || HouseBackyardPlaceholder}
                      alt="Backyard Pic"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Box>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  margin: "0 32px",
                }}
              >
                {property.open && (
                  <Typography variant="h6" sx={{ color: "success.main" }}>
                    OPEN
                  </Typography>
                )}
                {!property.open && (
                  <Typography variant="h6" sx={{ color: "error.main" }}>
                    CLOSED
                  </Typography>
                )}
                <Typography variant="h2">{property.address}</Typography>
                <PropertyFeaturesComponent
                  bedrooms={property.bedrooms}
                  bathrooms={property.bathrooms}
                  garages={property.garages}
                  property_type={property.property_type}
                />
                <Typography
                  variant="body"
                  sx={{ marginTop: "8px", fontSize: "20px" }}
                >{`$${property.price} /per week`}</Typography>
                <Typography variant="body" sx={{ marginTop: "8px" }}>
                  {`${property.land_sqm}`} m<sup>2</sup>
                </Typography>
                {isCreator && (
                  <Box
                    sx={{
                      display: "flex",
                      marginTop: "16px",
                    }}
                  >
                    <Button
                      color="secondary"
                      variant="outlined"
                      onClick={() => history.push(`/property/${estateId}/edit`)}
                    >
                      <EditIcon />
                      Edit
                    </Button>
                    {property.open && (
                      <Button
                        color="error"
                        variant="outlined"
                        onClick={closeProperty}
                        sx={{ marginLeft: "16px" }}
                      >
                        <CloseIcon />
                        Close
                      </Button>
                    )}
                    {!property.open && (
                      <Button
                        variant="outlined"
                        onClick={openProperty}
                        sx={{ marginLeft: "16px" }}
                      >
                        <HomeIcon />
                        Open
                      </Button>
                    )}
                  </Box>
                )}
              </Box>
            </Grid>
          </Box>
          <Divider sx={{ width: "100%", margin: "16px 0" }} />
          <Box sx={{ margin: "0 32px" }}>
            <Typography variant="h3">{property.title}</Typography>
            <Typography
              variant="body1"
              sx={{ marginTop: "16px", whiteSpace: "pre-wrap" }}
            >
              {property.description}
            </Typography>
          </Box>
          <Divider sx={{ width: "100%", margin: "16px 0" }} />
          <Box sx={{ margin: "0 32px" }}>
            <Typography variant="h4" mt={4}>
              Inspection Times
            </Typography>
            {property.inspection_dates.length === 0 && (
              <Typography mt={2} variant="subtitle1" color="error.main">
                No inspection times listed
              </Typography>
            )}
            {property.inspection_dates.map(
              ({ inspectionId, start_date, end_date }) => (
                <Box
                  key={`inspection-id-${inspectionId}`}
                  mt={2}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="subtitle1">{`${format(
                    new Date(start_date),
                    "PPpp"
                  )} - ${format(new Date(end_date), "PPpp")}`}</Typography>
                  {isCreator && (
                    <Button
                      onClick={() => removeInspectionTimes(inspectionId)}
                      sx={{ marginLeft: "16px", color: "error.main" }}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              )
            )}
          </Box>
          <Divider sx={{ width: "100%", margin: "16px 0" }} />
          <Box sx={{ margin: "0 32px" }}>
            <Typography variant="h4" mt={4}>
              Agent Details
            </Typography>
            <Typography variant="body1" sx={{ marginTop: "16px" }}>
              {`Agent Name: ${property.agent.first_name} ${property.agent.last_name}`}
            </Typography>
            <Typography variant="body" sx={{ marginTop: "8px" }}>
              {`Agent Email: ${property.agent.email}`}
            </Typography>
            {!!property.agent.phone && (
              <div>
                <Typography variant="body" sx={{ marginTop: "8px" }}>
                  {`Agent Mobile: ${property.agent.phone}`}
                </Typography>
              </div>
            )}
            {!isCreator && (
              <Box>
                <Button
                  color="secondary"
                  variant="outlined"
                  sx={{ marginTop: "16px" }}
                  onClick={() => setOpen(true)}
                >
                  Contact Host
                </Button>
              </Box>
            )}
            {!isCreator && (
              <Contact property={property} open={open} setOpen={setOpen} />
            )}
          </Box>
        </Grid>
      )}
    </Box>
  );
}

export default PropertyDetails;
