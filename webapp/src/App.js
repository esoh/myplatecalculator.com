import React from 'react';
import { ThemeProvider, createMuiTheme } from '@mui/material/styles';
import './App.css';
import PlateCalculator from './PlateCalculator';
import RpeCalculator from './RpeCalculator';
import {Route, Routes, BrowserRouter as Router} from "react-router-dom";

const theme = createMuiTheme();

const App = () => (
  <ThemeProvider theme={theme}>
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<PlateCalculator />}/>
          <Route path="/rpe" element={<RpeCalculator />}/>
        </Routes>
      </Router>
    </div>
  </ThemeProvider>
);

export default App;
