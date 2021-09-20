import React, { useState } from 'react';
import './App.css';
import Input from '@material-ui/core/Input';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

const UNIT = {
  KG: "KG",
  LB: "LB",
};

const PLATE_TYPES = {
  [UNIT.KG]: [25, 20, 15, 10, 5, 2.5, 1.25],
  [UNIT.LB]: [45, 35, 25, 10, 5, 2.5, 1.25],
};

const BAR_WEIGHT = {
  [UNIT.KG]: 20,
  [UNIT.LB]: 45,
};

const percentages = [0.475, 0.60, 0.725, 0.825, 0.9, 0.96, 1];
const roundToNearest = (number, step) => Math.round(number/step) * step;
const toPlates = (number, unit) => {
  const platesAvailable = unit === UNIT.KG ? PLATE_TYPES.KG : PLATE_TYPES.LB;
  const barWeight = unit === UNIT.KG ? BAR_WEIGHT.KG : BAR_WEIGHT.LB;
  if (number < barWeight) return 'less than bar';

  const platesStrings = [];
  let left = (number - barWeight)/2;
  for (let i = 0; i < platesAvailable.length && left !== 0; i += 1) {
    const candidatePlateWeight = platesAvailable[i];
    const numPlates = Math.floor(left / candidatePlateWeight);
    if (numPlates) platesStrings.push(`${numPlates} x ${candidatePlateWeight}${unit}`);
    left -= numPlates * candidatePlateWeight;
  }

  return platesStrings.join('\n');
};

const LBS_IN_KGS = 2.20462262;

const rnd = val => Math.round((val + Number.EPSILON) * 100) / 100;
const convertValue = (value, oldUnit, newUnit) => {
  if (oldUnit === UNIT.KG) {
    if (!isNaN(parseFloat(value))) return parseFloat(rnd(parseFloat(value) * LBS_IN_KGS).toFixed(2));
    return value;
  } else {
    if (!isNaN(parseFloat(value))) return parseFloat(rnd(parseFloat(value) / LBS_IN_KGS).toFixed(2));
    return value;
  }
};

const useStyles = makeStyles(theme => ({
  tableRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

function App() {
  const [num, setNum] = useState('');
  const [unit, setUnit] = useState(UNIT.LB);
  const styles = useStyles();

  const handleChangeUnit = e => setUnit(oldUnit => {
    const newUnit = e.target.value;
    setNum(prev => convertValue(prev, oldUnit, newUnit));
    return newUnit;
  });

  const number = isNaN(num) ? null : parseFloat(num);

  return (
    <div className="App">
      <Box flexDirection="row" display="flex" justifyContent="center">
        <Input
          placeholder="225"
          autoFocus
          value={num}
          onChange={e => setNum(e.target.value)}
          onFocus={event => {
            event.target.select();
          }}
        />
        <RadioGroup row value={unit} onChange={handleChangeUnit}>
          <FormControlLabel value={UNIT.LB} control={<Radio />} label="LB" />
          <FormControlLabel value={UNIT.KG} control={<Radio />} label="KG" />
        </RadioGroup>
      </Box>

      <TableContainer component={Paper}>
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
            {percentages.map((percent, i) => (
              <TableRow key={percent} className={styles.tableRow}>
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
    </div>
  );
}

export default App;
