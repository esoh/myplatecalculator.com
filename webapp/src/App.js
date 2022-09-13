import React, {useState} from 'react';
import { ThemeProvider, createMuiTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import './App.css';
import PlateCalculator from './PlateCalculator';
import RpeCalculator from './RpeCalculator';
import {Route, Routes, useNavigate} from "react-router-dom";

const theme = createMuiTheme();

const App = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = route => {
    navigate(route);
    setIsDrawerOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
          <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
            <List>
              <ListItem disablePadding onClick={() => handleNavigate('/')}>
                <ListItemButton>
                  <ListItemText primary="Plate Calculator" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding onClick={() => handleNavigate('/rpe')}>
                <ListItemButton>
                  <ListItemText primary="RPE Calculator" />
                </ListItemButton>
              </ListItem>
            </List>
          </Drawer>
          <Routes>
            <Route path="/" element={<PlateCalculator onClickMenu={() => setIsDrawerOpen(true)} />}/>
            <Route path="/rpe" element={<RpeCalculator onClickMenu={() => setIsDrawerOpen(true)} />}/>
          </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;
