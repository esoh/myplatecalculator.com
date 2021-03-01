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

const percentages = [0.475, 0.60, 0.725, 0.825, 0.9, 0.96, 1];
const roundToNearest = (number, step) => Math.round(number/step) * step;
const toPlates = number => {
  const platesAvailable = [45, 35, 25, 10, 5, 2.5, 1.25];
  if (number < 45) return 'less than bar';

  const platesStrings = [];
  let left = (number - 45)/2;
  for (let i = 0; i < platesAvailable.length && left !== 0; i += 1) {
    const candidatePlateWeight = platesAvailable[i];
    const numPlates = Math.floor(left / candidatePlateWeight);
    if (numPlates) platesStrings.push(`${numPlates} x ${candidatePlateWeight}lbs`);
    left -= numPlates * candidatePlateWeight;
  }

  return platesStrings.join('\n');
};

function App() {
  const [num, setNum] = useState();

  const number = isNaN(num) ? null : parseFloat(num);

  return (
    <div className="App">
      <Input
        placeholder="225"
        autoFocus
        onChange={e => setNum(e.target.value)}
        onFocus={event => {
          event.target.select();
        }}
      />
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
            {percentages.map(percent => (
              <TableRow key={percent}>
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
                    {isNaN(number) ? '' : toPlates(roundToNearest(percent * number, 2.5))}
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
