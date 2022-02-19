import DateTimePicker from "@mui/lab/DateTimePicker";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import {
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
  useJsApiLoader,
} from "@react-google-maps/api";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import API from "../../services/api";
import DraggablePropertyCard from "./DraggablePropertyCard";
import RouteProperties from "./RouteProperties";
import userContext from "../../lib/context";
import {
  getArriveAndDepatureTime,
  getTravelTimeFromRoute,
  getUserId,
} from "../../lib/helper";
import { format, addDays } from "date-fns";
import { useHistory } from "react-router";

function Route() {
  const { user } = useContext(userContext);
  const agentId = getUserId(user.token);
  const history = useHistory();
  const [propertiesToInspect, setPropertiesToInspect] = useState([]);
  const [startTime, setStartTime] = useState(addDays(new Date(), 1));
  const [userAddress, setUserAddress] = useState(null);
  const [direction, setDirection] = useState(null);
  // Hotfix for direction service spamming API calls
  const [itineraryUpdated, setItineraryUpdated] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: API.getMapsKey(),
  });

  const addToItinerary = useCallback(
    (property, duration) => {
      setItineraryUpdated(true);
      setPropertiesToInspect([...propertiesToInspect, { property, duration }]);
    },
    [propertiesToInspect, setPropertiesToInspect]
  );

  const removeFromItinerary = useCallback(
    (index) => {
      const updatedProperties = propertiesToInspect.slice();
      updatedProperties.splice(index, 1);
      setPropertiesToInspect(updatedProperties);
      setItineraryUpdated(true);
    },
    [propertiesToInspect, setPropertiesToInspect]
  );

  const moveProperty = useCallback(
    (dragIndex, hoverIndex) => {
      const draggedProperty = propertiesToInspect[dragIndex];
      const updatedProperties = propertiesToInspect.slice();
      updatedProperties.splice(dragIndex, 1);
      updatedProperties.splice(hoverIndex, 0, draggedProperty);
      setPropertiesToInspect(updatedProperties);
      setItineraryUpdated(true);
    },
    [propertiesToInspect, setPropertiesToInspect]
  );

  const directionsCallback = (response) => {
    if (response !== null && !!itineraryUpdated) {
      if (response.status === "OK") {
        setDirection(response);
        setItineraryUpdated(false);
      } else {
        console.log("ERROR:", response);
        setError(response.status);
      }
    }
  };

  const getTimes = useCallback(() => {
    return getArriveAndDepatureTime(
      startTime,
      getTravelTimeFromRoute(direction),
      propertiesToInspect
    );
  }, [startTime, direction, propertiesToInspect]);

  const handleSubmit = useCallback(async () => {
    const times = getTimes();
    for (let i = 0; i < propertiesToInspect.length; i++) {
      await API.addInspectionTimes(
        agentId,
        propertiesToInspect[i].property.id,
        {
          start_date: parseInt(times[i].arriveAt.getTime() / 1000),
          end_date: parseInt(times[i].departAt.getTime() / 1000),
        }
      );
    }
    setOpen(false);
    history.push("/");
  }, [history, propertiesToInspect, agentId, getTimes]);

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await API.getUser(agentId);
      // Temporary placeholder for user address
      setUserAddress(
        fetchedUser.address === ""
          ? "UNSW Library, Library, Kensington NSW 2035"
          : fetchedUser.address
      );
    };
    fetchUser();
  }, [agentId]);

  return (
    <>
      {!isLoaded && !userAddress && <CircularProgress />}
      {isLoaded &&
        !!userAddress &&
        getTimes().length === propertiesToInspect.length && (
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Confirm Itinerary</DialogTitle>
            <DialogTitle sx={{ paddingTop: "0px" }}>
              {format(startTime, "PPPpp")}{" "}
            </DialogTitle>
            <DialogContent dividers>
              {propertiesToInspect.map(({ property }, index) => (
                <DialogContentText key={`itinerary-summary-${index}`}>
                  {`Arrive at ${property.address} at ${format(
                    getTimes()[index].arriveAt,
                    "p"
                  )} and depart at ${format(getTimes()[index].departAt, "p")}`}
                </DialogContentText>
              ))}
            </DialogContent>
            <Button
              onClick={handleSubmit}
              sx={{
                margin: "8px 0",
              }}
            >
              Add Inspection Times
            </Button>
          </Dialog>
        )}
      {isLoaded && !!userAddress && (
        <Grid container sx={{ padding: "0 0 16px 0" }}>
          <Grid item xs={12}>
            <GoogleMap
              id="inspection-route"
              mapContainerStyle={{
                height: "400px",
                width: "100%",
              }}
              zoom={2}
              center={{
                lat: 0,
                lng: -180,
              }}
            >
              {propertiesToInspect.length > 0 && (
                <DirectionsService
                  options={{
                    origin: userAddress,
                    destination:
                      propertiesToInspect[propertiesToInspect.length - 1]
                        .property.address,
                    travelMode: "DRIVING",
                    waypoints: propertiesToInspect
                      .slice(0, propertiesToInspect.length - 1)
                      .map((p) => ({
                        location: p.property.address,
                        stopover: true,
                      })),
                    drivingOptions: {
                      departureTime: startTime,
                    },
                  }}
                  callback={directionsCallback}
                />
              )}
              {direction !== null && (
                <DirectionsRenderer
                  options={{
                    directions: direction,
                  }}
                />
              )}
            </GoogleMap>
          </Grid>
          <DndProvider backend={HTML5Backend}>
            <Grid item xs={6}>
              <Box
                mt={2}
                ml={2}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h3" mb={2}>
                  Itinerary
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    label="Start Time"
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e);
                      setItineraryUpdated(true);
                    }}
                  />
                  <Typography
                    mt={2}
                    variant="subtitle2"
                  >{`START: ${userAddress}`}</Typography>
                </Box>
                <Box
                  mr={4}
                  ml={4}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "64px 0",
                  }}
                >
                  {propertiesToInspect.map((p, index) => (
                    <DraggablePropertyCard
                      key={p.property.id}
                      property={p.property}
                      index={index}
                      moveProperty={moveProperty}
                      remove={() => removeFromItinerary(index)}
                      times={getTimes()}
                    />
                  ))}
                </Box>
                <Button
                  onClick={() => setOpen(true)}
                  disabled={propertiesToInspect.length === 0}
                >
                  Save
                </Button>
                {error && <Box color="error.main">{error}</Box>}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h3" mt={2}>
                Available Properties
              </Typography>
              <Typography variant="caption">
                List will be sorted based on distance from the last added
                property
              </Typography>
              <RouteProperties
                onSubmit={addToItinerary}
                selectedProperty={
                  propertiesToInspect[propertiesToInspect.length - 1]?.property
                }
              />
            </Grid>
          </DndProvider>
        </Grid>
      )}
    </>
  );
}

export default Route;
