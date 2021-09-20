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
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import {
  roundToNearest,
  toPlates,
  convertValue,
} from './utils';
import {
  UNIT,
  JUMP_CONFIG,
} from './constants';

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
  const [jumpConfigKey, setJumpConfigKey] = useState(JUMP_CONFIG.MATT_GARY.key);
  const handleChangeJumpConfig = e => setJumpConfigKey(e.target.value);
  const styles = useStyles();

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
        />
        <RadioGroup row value={unit} onChange={handleChangeUnit}>
          <FormControlLabel value={UNIT.LB} control={<Radio />} label="LB" />
          <FormControlLabel value={UNIT.KG} control={<Radio />} label="KG" />
        </RadioGroup>

        <IconButton
          aria-label="close"
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
          onClick={() => setIsSettingsOpen(true)}
        >
          <SettingsIcon />
        </IconButton>
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
            {jumpConfig.values.map((percent, i) => (
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

export default App;
