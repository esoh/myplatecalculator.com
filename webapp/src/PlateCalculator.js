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
import Chip from '@mui/material/Chip';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import SettingsIcon from '@mui/icons-material/Settings';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
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
    overflowY: 'scroll',
  },
  input: {
    marginRight: theme.spacing(2),
    maxWidth: 100,
  },
  unitChip: {
    width: 40,
  },
}));

export default function PlateCalculator() {
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

  const onChangeUnit = newUnit => {
    setUnit(newUnit);
    localStorage.setItem(LOCAL_STORAGE.UNIT, newUnit);
  }

  const onSwitchUnit = () => {
    const newUnit = unit === UNIT.KG ? UNIT.LB : UNIT.KG;

    setUnit(oldUnit => {
      setNum(prev => convertValue(prev, oldUnit, newUnit));
      return newUnit;
    });
    localStorage.setItem(LOCAL_STORAGE.UNIT, newUnit);
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
    <>
      <Box
        flexDirection="row"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
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

        <Chip
          label="LB"
          size="small"
          onClick={() => onChangeUnit(UNIT.LB)}
          color='primary'
          className={classes.unitChip}
          variant={unit !== UNIT.LB ? 'outlined' : 'filled'}
        />

        <IconButton
          aria-label="convert"
          onClick={onSwitchUnit}
          disabled={isNaN(parseFloat(num))}
        >
          {unit === UNIT.LB ? <ArrowCircleRightIcon /> : <ArrowCircleLeftIcon />}
        </IconButton>

        <Chip
          label="KG"
          size="small"
          onClick={() => onChangeUnit(UNIT.KG)}
          color='primary'
          className={classes.unitChip}
          variant={unit !== UNIT.KG ? 'outlined' : 'filled'}
        />

        <div style={{ position: 'absolute', right: 0 }}>
          <IconButton
            aria-label="settings"
            onClick={() => setIsSettingsOpen(true)}
          >
            <SettingsIcon />
          </IconButton>
        </div>
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
            {[1, ...jumpConfig.values].map((percent, i) => {
              const boldStyle = percent === 1 ? { fontWeight: 'bold' } : undefined;
              return (
                <TableRow key={percent} className={classes.tableRow}>
                  <TableCell component="th" scope="row" style={boldStyle}>
                    {`${percent * 100}%`}
                  </TableCell>
                  <TableCell align="right" style={boldStyle}>
                    {isNaN(number) ? '' : parseFloat((percent * number).toFixed(2)).toString()}
                  </TableCell>
                  <TableCell align="right" style={boldStyle}>
                    {isNaN(number) ? '' : roundToNearest(percent * number, minPlate * 2).toString()}
                  </TableCell>
                  <TableCell align="right">
                    <Typography style={{whiteSpace: 'pre-line', ...boldStyle}}>
                      {isNaN(number) ? '' : toPlates(roundToNearest(percent * number, minPlate * 2), unit)}
                    </Typography>
                  </TableCell>
                </TableRow>
              )
            })}
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
    </>
  );
}
