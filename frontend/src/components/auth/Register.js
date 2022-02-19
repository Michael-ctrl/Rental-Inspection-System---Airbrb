import { Button, MenuItem, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import API from "../../services/api";
import useAPI from "../../services/useApi";
import { usePlacesWidget } from "react-google-autocomplete";
import {
  ROLE_INSPECTOR,
  ROLE_MANAGER,
  NAVBAR_HEIGHT,
  SUBNAV_HEIGHT,
} from "../../const";
import { hashString } from "../../lib/helper";

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  height: calc(100vh - ${NAVBAR_HEIGHT}px - ${SUBNAV_HEIGHT}px);
  width: 100%;
`;

const userTypes = [
  {
    value: ROLE_MANAGER,
    label: "Property Manager",
  },
  {
    value: ROLE_INSPECTOR,
    label: "Property Inspector",
  },
];

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("");
  const history = useHistory();
  const { ref } = usePlacesWidget({
    apiKey: API.getMapsKey(),
    onPlaceSelected: (place) => setAddress(place.formatted_address),
    options: {
      types: ["address"],
    },
  });

  const register = useCallback(async () => {
    return API.register({
      firstName,
      lastName,
      password: hashString(password),
      email,
      address,
      phone,
      type,
    });
  }, [firstName, lastName, password, email, address, phone, type]);

  const [{ inProgress, error, data }, makeRequest] = useAPI(register);

  useEffect(() => {
    if (!inProgress && !error && !!data && (data.agentId || data.inspectorId)) {
      history.push("/");
    }
  }, [data, history, error, inProgress]);

  const handleSubmit = (e) => {
    e.preventDefault();
    makeRequest();
  };

  return (
    <RegisterForm onSubmit={handleSubmit}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "50%",
          maxWidth: "400px",
        }}
      >
        <TextField
          required
          label="First Name"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          sx={{
            marginTop: "8px",
          }}
        />
        <TextField
          required
          label="Last Name"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          sx={{
            marginTop: "8px",
          }}
        />
        <TextField
          required
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            marginTop: "8px",
          }}
        />
        <TextField
          required
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            marginTop: "8px",
          }}
        />
        <TextField
          inputRef={ref}
          required
          label="Address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          sx={{
            marginTop: "8px",
          }}
        />
        <TextField
          label="Phone"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          sx={{
            marginTop: "8px",
          }}
        />
        <TextField
          select
          required
          label="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          sx={{
            marginTop: "16px",
          }}
          helperText="Please select what type of user you are"
        >
          {userTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <Button
          type="submit"
          sx={{
            marginTop: "8px",
          }}
        >
          {!inProgress ? "Register" : "Loading..."}
        </Button>
      </Box>
      {!!error && <Box sx={{ color: "error.main" }}>{error}</Box>}
    </RegisterForm>
  );
}

export default Register;
