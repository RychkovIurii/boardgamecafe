import React from 'react'
import { useState } from 'react';
import './Style/BookingFormStyles.css';
import API from '../api/axios';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  TextField,
} from '@mui/material';


/**
  
 StepOne, StepTwo, and StepThree are separated for clarity.
 You can define them inline, in separate files, or as your project needs.*/
function StepOne({ inputs, handleChange }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Step 1: Personal Info
      </Typography>
      <div className='formItem'>
        <label>Name: </label>
        <input
          className='formInput'
          type='text'
          name="contactName"
          value={inputs.contactName || ""}
          onChange={handleChange}
          required
        />
      </div>
      <div className='formItem'>
        <label>Phone Number: </label>
        <input
          className='formInput'
          type='text'
          name="contactPhone"
          value={inputs.contactPhone || ""}
          onChange={handleChange}
          required
        />
      </div>
      <div className='formItem'>
        <label>Date: </label>
        <input
          className='formInput'
          type='date'
          min={new Date().toJSON().slice(0, 10)}
          name="date"
          value={inputs.date || ""}
          onChange={handleChange}
          required
        />
      </div>
      <div className='formItem'>
        <label>Start time: </label>
        <input
          className='formInput'
          type='time'
          name="startTime"
          value={inputs.startTime || ""}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Duration: </label>
        <input
          className='formInput'
          type='number'
          name='duration'
          value={inputs.duration || ""}
          onChange={handleChange}
          min={60}
          step={30}
          placeholder="Duration (minutes)"
          required
        />

      </div>
    </Box>
  );
}

function StepTwo({inputs, handleChange}) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Step 2: Table and Game Selection (Optional)
      </Typography>
      <label>Table: </label>
      <input
        className='formInput'
        type='number'
        min={1}
        max={12}
        name='tableId'
        value={inputs.tableId || ""}
        placeholder="Table ID"
        onChange={handleChange}
        required
      />
      <br />
      <label>Game: </label>
      <input
        className='formInput'
        type='text'
        name="gameId"
        value={inputs.gameId || ""}
        onChange={handleChange}
      />
    </Box>
  );
}

function StepThree({inputs, handleChange, handleSubmit}) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Step 3: Review &amp; Submit
      </Typography>
      <Typography variant="body1" gutterBottom>
        Here, you can show a summary of all fields from previous steps, or simply
        prompt the user to submit.
      </Typography>
    </Box>
  );
}



export default function BookingForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [inputs, setInputs] = useState({
    date: "",
    startTime: "",
    duration: "",
    tableId: "",
    players: "",
    gameId: "",
    userId: "",
    contactName: "",
    contactPhone: ""
  });

  // Define the labels for each step.
  const steps = ['Personal Info', 'Table and Game Selection (Optional)', 'Review & Submit'];

  // Handle next step
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // Handle previous step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Handle form submission or final step action
  const handleSubmit = () => {
    // e.g., call an API or finalize your form submission logic here
    alert('Form submitted!');
  };

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value })
  }
  // Renders the content for each step
  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return <StepOne inputs={inputs} handleChange={handleChange} />;
      case 1:
        return <StepTwo inputs={inputs} handleChange={handleChange} />;
      case 2:
        return <StepThree inputs={inputs} handleChange={handleChange} handleSubmit={handleSubmit}/>;
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
      <Stepper activeStep={activeStep} sx={{ marginBottom: 3 }}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === steps.length ? (
        // Optional: You can show a completion screen or message here
        <Typography variant="h5">All steps completed!</Typography>
      ) : (
        <>
          {renderStepContent(activeStep)}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="contained"
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button onClick={handleSubmit} variant="contained" color="primary">
                Submit
              </Button>
            ) : (
              <Button onClick={handleNext} variant="contained" color="primary">
                Next
              </Button>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}

