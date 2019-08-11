import React, {useContext, useState, useEffect} from 'react';
import AuthContext from "./contexts";
import axios, { AxiosInstance } from 'axios';

import {withStyles, createStyles, Theme, WithStyles} from '@material-ui/core/styles/';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

const styles = (theme:Theme) => createStyles({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  progress: {
    margin:  'auto',
    display: 'block',
  },
});
interface Props extends WithStyles<typeof styles> {
  tableUser: string;
}

const getHoldings = async (tableUser:string, axiosInstance: AxiosInstance) => {
  let holdingObject = null;
  try{
      let response = await axiosInstance.get(`apis/getHoldings?user=${tableUser}`);
      holdingObject = response.data;
  }
  catch(error){
    if(error.response.status === 403) throw new Error("login error");
  }
  finally{
    return holdingObject;
  }
}

const getFund = async (fundName:string, axiosInstance: AxiosInstance) => {
  let fundPrice = null;
  try{
    let response = await axiosInstance.get(`apis/getFund?&fund=${fundName}`);
    fundPrice = response.data;
  }
  catch(error){
    if(error.response.status === 403) throw new Error("login error");
  }
  finally{
    return fundPrice;
  }
}


const FundTable = (props:Props) => {
  const {classes, tableUser} = props;
  const auth = useContext(AuthContext);
  const [data, setData] = useState([] as any);
  const [dataTotal, setDataTotal] = useState([] as any);
  const [tableUserUpdate, setTableUserUpdate] = useState(tableUser);

  const axiosInstance = axios.create({
    baseURL: 'https://fund.robertzhao.com/',
    headers: {'Authorization': auth.user}
  });

  if (tableUserUpdate !== tableUser){
    setTableUserUpdate(tableUser);
    setData([]);
  }

  useEffect( () => {
      generateTable(tableUserUpdate);
    }, [data.length]);

  const generateTable =  async (tableUser: string) => {
    try{
      let holdingObject = await getHoldings(tableUser, axiosInstance);
      if (!holdingObject) return null;
      let fundList = Object.keys(holdingObject);
      let myData = [];
  
      let totalCAD = 0;
      let totalUSD = 0;
      let totalInitialCAD = 0;
      let totalInitialUSD = 0;

      for(let i = 0; i < fundList.length; i++){
          let rowData:any = {'id' : i};
          let fundName = fundList[i];
          let unitPrice = await getFund(fundName, axiosInstance);
          if (!unitPrice) return null;
          rowData['fundCode'] = fundName;
          rowData['unitPrice'] = unitPrice;
          rowData['holdingValue'] = Number(holdingObject[fundName]['share']) * Number(unitPrice);
          rowData['initialPrice'] = holdingObject[fundName]['initialPrice'];
          rowData['currency'] = holdingObject[fundName]['currency'];
          myData.push(rowData);
          if (rowData['currency'] === 'CAD'){
            totalCAD += Number(rowData['holdingValue']);
            totalInitialCAD += Number(rowData['initialPrice']) * Number(holdingObject[fundName]['share']);
          }else{
            totalUSD += Number(rowData['holdingValue']);
            totalInitialUSD += Number(rowData['initialPrice']) * Number(holdingObject[fundName]['share']);
          }
      }
      setData(myData);
      setDataTotal([{'currency': 'CAD', 'totalValue' : totalCAD, id: 1, 'totalInitial' : totalInitialCAD}, 
      {'currency': 'USD', 'totalValue' : totalUSD, id: 2,  'totalInitial' : totalInitialUSD}]);
    }
    catch(error){
      auth.updateAuth({loggedIn: false, user: ''});
    }
  }

  if(data.length === 0){
    return <CircularProgress className={classes.progress} />
  }else{
      return (
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Fund Code</TableCell>
                <TableCell align="right">Unit Price</TableCell>
                <TableCell align="right">Holding Value</TableCell>
                <TableCell align="right">Initial Price</TableCell>
                <TableCell align="right">Currency</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((n:any) => (
                <TableRow key={n.id}>
                  <TableCell component="th" scope="row">
                    {n.fundCode}
                  </TableCell>
                  <TableCell align="right">{n.unitPrice}</TableCell>
                  <TableCell align="right">{n.holdingValue}</TableCell>
                  <TableCell align="right">{n.initialPrice}</TableCell>
                  <TableCell align="right">{n.currency}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Typography variant="h4" gutterBottom component="h2">
            Total
          </Typography>
          <Table className={classes.root}>
          <TableHead>
            <TableRow>
              <TableCell>Currency</TableCell>
              <TableCell align="right">Total Initial</TableCell>
              <TableCell align="right">Total Value</TableCell>
            </TableRow>
            </TableHead>
          <TableBody>
            {dataTotal.map((n:any) => (
                <TableRow key={n.id}>
                  <TableCell component="th" scope="row">
                    {n.currency}
                  </TableCell>
                  <TableCell align="right">{n.totalInitial}</TableCell>
                  <TableCell align="right">{n.totalValue}</TableCell>
                </TableRow>
            ))}
          </TableBody>
          </Table>
        </Paper>
    );
    }
}

export default withStyles(styles)(FundTable);