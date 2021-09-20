import React, { useState } from 'react';
import './App.css';
import Input from '@mui/material/Input';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { ThemeProvider, createMuiTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import {
  roundToNearest,
  toPlates,
  convertValue,
} from './utils';
import {
  UNIT,
  JUMP_CONFIG,
  LOCAL_STORAGE,
} from './constants';

const useStyles = makeStyles(theme => ({
  tableRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  table: {
    marginBottom: theme.spacing(4),
  },
  settingsIcon: {
    position: 'absolute',
    right: 8,
  },
  input: {
    marginRight: theme.spacing(2),
    maxWidth: 100,
  },
}));

function Main() {
  const [num, setNum] = useState('');
  const [unit, setUnit] = useState(UNIT.LB);
  const [jumpConfigKey, setJumpConfigKey] = useState(localStorage.getItem(LOCAL_STORAGE.CONFIG) || JUMP_CONFIG.MATT_GARY.key);
  const handleChangeJumpConfig = e => {
    setJumpConfigKey(e.target.value);
    localStorage.setItem(LOCAL_STORAGE.CONFIG, e.target.value);
  }
  const classes = useStyles();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const onClose = () => setIsSettingsOpen(false);

  const handleChangeUnit = e => setUnit(oldUnit => {
    const newUnit = e.target.value;
    setNum(prev => convertValue(prev, oldUnit, newUnit));
    return newUnit;
  });

  const number = isNaN(num) ? null : parseFloat(num);

  const jumpConfig = JUMP_CONFIG[jumpConfigKey];
  return (
    <div className="App">
      <Box flexDirection="row" display="flex" justifyContent="center">
        <Input
          placeholder="225"
          autoFocus
          type="number"
          value={num}
          onChange={e => setNum(e.target.value)}
          onFocus={event => {
            event.target.select();
          }}
          className={classes.input}
        />
        <RadioGroup row value={unit} onChange={handleChangeUnit}>
          <FormControlLabel value={UNIT.LB} control={<Radio />} label="LB" />
          <FormControlLabel value={UNIT.KG} control={<Radio />} label="KG" />
        </RadioGroup>

        <IconButton
          aria-label="close"
          className={classes.settingsIcon}
          onClick={() => setIsSettingsOpen(true)}
        >
          <SettingsIcon />
        </IconButton>
      </Box>

      <TableContainer component={Paper} className={classes.table}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>%</TableCell>
              <TableCell align="right">Weight</TableCell>
              <TableCell align="right">Rounded</TableCell>
              <TableCell align="right">Plates on one side</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jumpConfig.values.map((percent, i) => (
              <TableRow key={percent} className={classes.tableRow}>
                <TableCell component="th" scope="row">
                  {`${percent * 100}%`}
                </TableCell>
                <TableCell align="right">
                  {isNaN(number) ? '' : parseFloat((percent * number).toFixed(2)).toString()}
                </TableCell>
                <TableCell align="right">
                  {isNaN(number) ? '' : roundToNearest(percent * number, 2.5).toString()}
                </TableCell>
                <TableCell align="right">
                  <Typography style={{whiteSpace: 'pre-line'}}>
                    {isNaN(number) ? '' : toPlates(roundToNearest(percent * number, 2.5), unit)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isSettingsOpen}>
        <DialogContent>
          <RadioGroup value={jumpConfigKey} onChange={handleChangeJumpConfig}>
            {Object.entries(JUMP_CONFIG).map(([k, v]) => (
              <FormControlLabel value={k} control={<Radio />} label={v.label} />
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Done</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const theme = createMuiTheme();
const App = () => (
  <ThemeProvider theme={theme}>
    <Main />
  </ThemeProvider>
);

export default App;
