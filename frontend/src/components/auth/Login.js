import {
  Button,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useCallback, useEffect, useState, useContext } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import { ROLE_INSPECTOR, ROLE_MANAGER } from "../../const";
import userContext from "../../lib/context";
import API from "../../services/api";
import useAPI from "../../services/useApi";
import { hashString } from "../../lib/helper";

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  height: 100%;
  width: 100%;
`;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isManager, setIsManager] = useState(true);
  const { setUserContext } = useContext(userContext);
  const history = useHistory();

  const login = useCallback(() => {
    return API.login(
      {
        username: email,
        password: hashString(password),
      },
      isManager
    );
  }, [email, password, isManager]);

  const [{ inProgress, error, data }, makeAPIRequest] = useAPI(login);

  useEffect(() => {
    if (!inProgress && !error && !!data) {
      // Updates state of user by setting a token
      setUserContext({
        token: data,
        role: isManager ? ROLE_MANAGER : ROLE_INSPECTOR,
      });
      history.push("/");
    }
  }, [inProgress, error, data, history, setUserContext, isManager]);

  const handleSubmit = (e) => {
    e.preventDefault();
    makeAPIRequest();
  };

  return (
    <LoginForm onSubmit={handleSubmit}>
      <TextField
        required
        label="Email"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{
          marginTop: "16px",
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
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              defaultChecked
              checked={isManager}
              onChange={() => setIsManager(!isManager)}
            />
          }
          label={isManager ? "Manager" : "Inspector"}
        />
      </FormGroup>
      <Button type="submit" sx={{ marginTop: "8px" }}>
        {!inProgress ? "Login" : "Loading..."}
      </Button>
      {!!error && (
        <Box sx={{ color: "error.main" }}>
          Username or password is incorrect
        </Box>
      )}
    </LoginForm>
  );
}

export default Login;
