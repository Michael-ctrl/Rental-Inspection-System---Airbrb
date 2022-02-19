import React, { useCallback, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import API from "../../services/api";

const formReset = (obj) => Object.keys(obj).forEach((k) => (obj[k] = ""));

function Contact({ property, open, setOpen }) {
  const [form, setForm] = useState({
    topic: "",
    address: "",
    message: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const submitContactForm = useCallback(async () => {
    const response = await API.sendEmail(property?.agent_id, {
      topic: form.topic,
      address: property?.address,
      message: form.message,
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
    });
    setOpen(false);
    formReset(form);
    return response;
  }, [property, form, setOpen]);

  const handleChange = (prop) => (event) => {
    setForm({ ...form, [prop]: event.target.value });
  };

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={() => {
        formReset(form);
        setOpen(false);
      }}
    >
      <DialogTitle sx={{ textAlign: "center" }}>
        Enquiry to {property.agent.first_name} {property.agent.last_name}
      </DialogTitle>
      <DialogContent dividers>
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
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-topic">Enquiry Topic</InputLabel>
            <Select
              labelId="demo-simple-select-topic"
              id="demo-simple-topic"
              value={form.topic}
              label="Enquiry Topic"
              onChange={handleChange("topic")}
            >
              <MenuItem value={"schedule_inspection"}>
                Schedule Inspection
              </MenuItem>
              <MenuItem value={"rental_rate"}>Rental Rate</MenuItem>
              <MenuItem value={"other"}>Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            disabled
            value={property.address}
            label="Property Address"
          />
          <TextField
            id="outlined-multiline-static"
            label="Message"
            multiline
            rows={4}
            value={form.message}
            onChange={handleChange("message")}
          />
          <TextField
            required
            value={form.first_name}
            onChange={handleChange("first_name")}
            label="First Name"
          />
          <TextField
            required
            value={form.last_name}
            onChange={handleChange("last_name")}
            label="Last Name"
          />
          <TextField
            required
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            label="Email"
          />
          <TextField
            value={form.phone}
            onChange={handleChange("phone")}
            label="Phone Number"
          />
        </Box>
      </DialogContent>
      <Button
        type="submit"
        onClick={() => {
          submitContactForm();
        }}
        sx={{
          margin: "8px 0",
        }}
      >
        Send Enquiry
      </Button>
    </Dialog>
  );
}

export default Contact;
