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
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
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
  SMALLEST_PLATE_OPTS,
  DEFAULT_SMALLEST_LB_PLATE,
  DEFAULT_SMALLEST_KG_PLATE,
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
  const [unit, setUnit] = useState(localStorage.getItem(LOCAL_STORAGE.UNIT) || UNIT.LB);
  const [jumpConfigKey, setJumpConfigKey] = useState(localStorage.getItem(LOCAL_STORAGE.CONFIG) || JUMP_CONFIG.DEFAULT.key);
  const handleChangeJumpConfig = e => {
    setJumpConfigKey(e.target.value);
    localStorage.setItem(LOCAL_STORAGE.CONFIG, e.target.value);
  }
  const classes = useStyles();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const onClose = () => setIsSettingsOpen(false);

  const handleChangeUnit = e => {
    setUnit(oldUnit => {
      const newUnit = e.target.value;
      setNum(prev => convertValue(prev, oldUnit, newUnit));
      return newUnit;
    });
    localStorage.setItem(LOCAL_STORAGE.UNIT, e.target.value);
  }

  const number = isNaN(num) ? null : parseFloat(num);

  const [smallestLbPlate, setSmallestLbPlate] = useState(() => {
    const localVal = localStorage.getItem(LOCAL_STORAGE.SMALLEST_LB_PLATE);
    if (localVal == null) return DEFAULT_SMALLEST_LB_PLATE;
    return isNaN(parseFloat(localVal)) ? DEFAULT_SMALLEST_LB_PLATE : parseFloat(localVal);
  });
  const handleChangeSmallestLbPlate = e => {
    const val = parseFloat(e.target.value);
    setSmallestLbPlate(val);
    localStorage.setItem(LOCAL_STORAGE.SMALLEST_LB_PLATE, val);
  }
  const [smallestKgPlate, setSmallestKgPlate] = useState(() => {
    const localVal = localStorage.getItem(LOCAL_STORAGE.SMALLEST_KG_PLATE);
    if (localVal == null) return DEFAULT_SMALLEST_KG_PLATE;
    return isNaN(parseFloat(localVal)) ? DEFAULT_SMALLEST_KG_PLATE : parseFloat(localVal);
  });
  const handleChangeSmallestKgPlate = e => {
    const val = parseFloat(e.target.value);
    setSmallestKgPlate(val);
    localStorage.setItem(LOCAL_STORAGE.SMALLEST_KG_PLATE, val);
  }

  const minPlate = unit === UNIT.KG ? smallestKgPlate : smallestLbPlate;

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
                  {isNaN(number) ? '' : roundToNearest(percent * number, minPlate * 2).toString()}
                </TableCell>
                <TableCell align="right">
                  <Typography style={{whiteSpace: 'pre-line'}}>
                    {isNaN(number) ? '' : toPlates(roundToNearest(percent * number, minPlate * 2), unit)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isSettingsOpen}>
        <DialogContent>
          <FormControl component="fieldset" margin="normal" fullWidth>
            <FormLabel component="legend">Percentages</FormLabel>
            <RadioGroup value={jumpConfigKey} onChange={handleChangeJumpConfig}>
              {Object.entries(JUMP_CONFIG).map(([k, v]) => (
                <FormControlLabel value={k} control={<Radio />} label={v.label} />
              ))}
            </RadioGroup>
          </FormControl>

          <FormControl component="fieldset" margin="normal" fullWidth>
            <FormLabel component="legend">Smallest LB plate</FormLabel>
            <RadioGroup value={smallestLbPlate} onChange={handleChangeSmallestLbPlate}>
              {SMALLEST_PLATE_OPTS.map(v => (
                <FormControlLabel value={v} control={<Radio />} label={`${v} LB`} />
              ))}
            </RadioGroup>
          </FormControl>

          <FormControl component="fieldset" margin="normal" fullWidth>
            <FormLabel component="legend">Smallest KG plate</FormLabel>
            <RadioGroup value={smallestKgPlate} onChange={handleChangeSmallestKgPlate}>
              {SMALLEST_PLATE_OPTS.map(v => (
                <FormControlLabel value={v} control={<Radio />} label={`${v} KG`} />
              ))}
            </RadioGroup>
          </FormControl>

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
