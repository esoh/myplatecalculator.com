import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';

const percentTableRows = [
  [100.00,95.50,92.20,89.20,86.30,83.70,81.10,78.60,76.20,73.90,70.70,68.00],
  [97.80,93.90,90.70,87.80,85.00,82.40,79.90,77.40,75.10,72.30,69.40,66.70],
  [95.50,92.20,89.20,86.30,83.70,81.10,78.60,76.20,73.90,70.70,68.00,65.30],
  [93.90,90.70,87.80,85.00,82.40,79.90,77.40,75.10,72.30,69.40,66.70,64.00],
  [92.20,89.20,86.30,83.70,81.10,78.60,76.20,73.90,70.70,68.00,65.30,62.60],
  [90.70,87.80,85.00,82.40,79.90,77.40,75.10,72.30,69.40,66.70,64.00,61.30],
  [89.20,86.30,83.70,81.10,78.60,76.20,73.90,70.70,68.00,65.30,62.60,59.90],
  [87.80,85.00,82.40,79.90,77.40,75.10,72.30,69.40,66.70,64.00,61.30,58.60],
  [86.30,83.70,81.10,78.60,76.20,73.90,70.70,68.00,65.30,62.60,59.90,null],
  [85.00,82.40,79.90,77.40,75.10,72.30,69.40,66.70,64.00,61.30,58.60,null],
  [83.70,81.10,78.60,76.20,73.90,70.70,68.00,65.30,62.60,59.90,null,null],
  [82.40,79.90,77.40,75.10,72.30,69.40,66.70,64.00,61.30,58.60,null,null],
  [81.10,78.60,76.20,73.90,70.70,68.00,65.30,62.60,59.90,null,null,null],
  [79.90,77.40,75.10,72.30,69.40,66.70,64.00,61.30,58.60,null,null,null],
  [78.60,76.20,73.90,70.70,68.00,65.30,62.60,59.90,null,null,null,null],
  [77.40,75.10,72.30,69.40,66.70,64.00,61.30,58.60,null,null,null,null],
  [76.20,73.90,70.70,68.00,65.30,62.60,59.90,null,null,null,null,null],
  [75.10,72.30,69.40,66.70,64.00,61.30,58.60,null,null,null,null,null],
  [73.90,70.70,68.00,65.30,62.60,59.90,null,null,null,null,null,null],
  [72.30,69.40,66.70,64.00,61.30,58.60,null,null,null,null,null,null],
  [70.70,68.00,65.30,62.60,59.90,null,null,null,null,null,null,null],
];

export default function RpeCalculator({onClickMenu}) {
  const containerRef = React.useRef(null);
  const [dimensions, setDimensions] = React.useState({height: 0, width: 0});

  React.useEffect(() => {
    function handleResize() {
      setDimensions({
        height: containerRef.current.clientHeight,
        width: containerRef.current.clientWidth,
      });
    }

    handleResize();
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, []);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box
        flexDirection="row"
        display="flex"
        style={{height: 40}}
      >
        <IconButton
          aria-label="menu"
          onClick={onClickMenu}
        >
          <MenuIcon/>
        </IconButton>
      </Box>

      <Box alignItems="center">
        <Typography fontSize={12} fontWeight="bold">Reps</Typography>
      </Box>
      <Box display="flex" flexDirection="row" flex={1}>
        <Typography fontSize={12} fontWeight="bold" alignSelf="center">RPE</Typography>
        <Box ref={containerRef} flex={1}>
          <TableContainer component={Paper} sx={{height: dimensions.height, width: dimensions.width, minWidth: 200, minHeight: 200}}>
            <Table size="small" aria-label="a dense table" stickyHeader padding="none">
              <TableHead>
                <TableRow>
                  <TableCell sx={{position: 'sticky', left: 0, backgroundColor: 'white'}}/>
                  {percentTableRows[0].map((_row, index) => (
                    <TableCell key={index} align="center" sx={{fontWeight: 'bold', zIndex: 2}}>{index + 1}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {percentTableRows.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" sx={{position: 'sticky', left: 0, backgroundColor: 'white', fontWeight: 'bold', zIndex: 1}}>
                      {10 - (index * 0.5)}
                    </TableCell>
                    {row.map((percent, ci) => (
                      <TableCell key={ci}>
                        <Box display="flex" justifyContent="center" marginLeft={0.5} marginRight={0.5}>
                          {percent === null ? '-' : (
                            <Input
                              size="small"
                              placeholder={percent.toString() + '%'}
                              type="number"
                              inputProps={{style: {padding: 0, fontSize: 10, minWidth: 34, textAlign: 'center'}}}
                              onFocus={event => {
                                event.target.select();
                              }}
                            />
                          )}
                        </Box>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}
