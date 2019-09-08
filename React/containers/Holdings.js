import React from 'react';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from '../components/Title';

function createHoldingsData(holdings, performanceRows, totalRows) {
  let totalUSDRow = { id: 0, totalInitial: 0, totalCurrent: 0 , currency: 'USD'};
  let totalCADRow = { ...totalUSDRow, currency: 'CAD' };
  for (let i = 0; i < holdings.holdingsOverview.length; i++) {
    let performanceRow = {};
    let fundId = holdings.holdingsOverview[i].fundId;
    let shares = holdings.holdingsOverview[i].shares;
    let initialPrice = holdings.fundsOverview[fundId].initialPrice;
    let currentPrice = holdings.fundsOverview[fundId].currentPrice;
    let currency = holdings.holdingsOverview[i].currency;
    performanceRow.id = i;
    performanceRow.fundId = fundId;
    performanceRow.shares = shares;
    performanceRow.initialPrice = initialPrice;
    performanceRow.currentPrice = currentPrice;
    performanceRow.initialValue = initialPrice * shares;
    performanceRow.currentValue = currentPrice * shares;
    performanceRow.currency = currency
    performanceRows.push(performanceRow);

    if (currency === "USD") {
      totalUSDRow.id = i;
      totalUSDRow.totalInitial += initialPrice * shares;
      totalUSDRow.totalCurrent += currentPrice * shares;
    } else if (currency === "CAD"){
      totalCADRow.id = i;
      totalCADRow.totalInitial += initialPrice * shares;
      totalCADRow.totalCurrent += currentPrice * shares;
    }
  }
  totalRows.push(totalUSDRow);
  totalRows.push(totalCADRow);
}

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  }
}));

const formatNumber = (num) =>{
  return num.toLocaleString('en-US', {maximumFractionDigits:2});
}

const mapStateToProps = (state) => {
  const { holdings   } = state.dashboard;
  return { holdings };
}

const Holdings = (props) => {

  const classes = useStyles();
  const { holdings } = props;

  const performanceRows = [];
  const totalRows = [];
  createHoldingsData(holdings, performanceRows, totalRows);

  return (
    <React.Fragment>
      <Paper className={classes.paper}>
        <Title> Performance </Title>
        <Table >
          <TableHead>
            <TableRow>
              <TableCell>Fund Code</TableCell>
              <TableCell align="right">Initial Price</TableCell>
              <TableCell align="right">Current Price</TableCell>
              <TableCell align="right">Shares</TableCell>
              <TableCell align="right">Current Value</TableCell>
              <TableCell align="right">Initial Value</TableCell>
              <TableCell>Currency</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {performanceRows.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.fundId}</TableCell>
                <TableCell align="right">${formatNumber(row.initialPrice)}</TableCell>
                <TableCell align="right">${formatNumber(row.currentPrice)}</TableCell>
                <TableCell align="right">{formatNumber(row.shares)}</TableCell>
                <TableCell align="right">${formatNumber(row.currentValue)}</TableCell>
                <TableCell align="right">${formatNumber(row.initialValue)}</TableCell>
                <TableCell>{row.currency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <br></br>
      <Paper className={classes.paper}>
        <Title> Total </Title>
        <Table >
          <TableHead>
            <TableRow>
              <TableCell>Currency</TableCell>
              <TableCell align="right">Total Initial Value</TableCell>
              <TableCell align="right">Total Current Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {totalRows.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.currency}</TableCell>
                <TableCell align="right">${formatNumber(row.totalInitial)}</TableCell>
                <TableCell align="right">${formatNumber(row.totalCurrent)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </React.Fragment>
  );
};

export default connect(mapStateToProps)(Holdings);