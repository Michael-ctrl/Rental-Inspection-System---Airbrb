import React from "react";
import BathtubIcon from "@mui/icons-material/Bathtub";
import BedIcon from "@mui/icons-material/Bed";
import GarageIcon from "@mui/icons-material/Garage";
import {
  Card,
  CardMedia,
  Box,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import styled from "styled-components";
import { capitalizeFirstLetter } from "../../lib/helper";
import { useHistory } from "react-router-dom";
import HousePlaceholder from "../../assets/house-placeholder.jpg";

const PropertyFeatures = styled.div`
  display: flex;
  align-items: center;
`;

const PropertyFeaturesContainer = styled.div`
  display: flex;

  margin-top: 8px;

  div:not(:first-child) {
    margin-left: 8px;
  }
`;

function Features({ num, icon }) {
  return (
    <PropertyFeatures>
      <Typography variant="h5">{num}</Typography>
      {icon}
    </PropertyFeatures>
  );
}

export function PropertyFeaturesComponent({
  bedrooms,
  bathrooms,
  garages,
  property_type,
}) {
  return (
    <PropertyFeaturesContainer>
      <Features num={bedrooms} icon={<BedIcon />} />
      <Features num={bathrooms} icon={<BathtubIcon />} />
      <Features num={garages} icon={<GarageIcon />} />
      <Divider orientation="vertical" sx={{ marginLeft: "8px" }} />
      <PropertyFeatures>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {capitalizeFirstLetter(property_type)}
        </Typography>
      </PropertyFeatures>
    </PropertyFeaturesContainer>
  );
}

function PropertyCard({ property, minify }) {
  const {
    id,
    title,
    property_type,
    address,
    bedrooms,
    bathrooms,
    garages,
    land_sqm,
    price,
    images,
  } = property;

  const history = useHistory();

  return (
    <Card sx={{ display: "flex", marginTop: "16px" }}>
      {!minify && (
        <CardMedia
          component="img"
          sx={{ width: 300 }}
          image={images || HousePlaceholder}
          alt="House Pic"
        />
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "16px",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="h5">{title}</Typography>
          <Typography variant="body" sx={{ marginTop: "8px" }}>
            {address}
          </Typography>
          <PropertyFeaturesComponent
            bedrooms={bedrooms}
            bathrooms={bathrooms}
            garages={garages}
            property_type={property_type}
          />
          <Typography variant="caption">{`Listed at $${price}/week`}</Typography>
          <Typography variant="caption">
            {`${land_sqm}`}m<sup>2</sup>
          </Typography>
        </Box>
        {!minify && (
          <Button onClick={() => history.push(`/property/${id}`)}>
            View more
          </Button>
        )}
      </Box>
    </Card>
  );
}

export default PropertyCard;
