import React from "react";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import userContext, { useUserContext } from "./lib/context";
import Router from "./router";

function App() {
  // Handles user information
  const [user, setUserContext] = useUserContext();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <userContext.Provider value={{ user, setUserContext }}>
        <Router />
      </userContext.Provider>
    </LocalizationProvider>
  );
}

export default App;
