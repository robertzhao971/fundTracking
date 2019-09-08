import axios from 'axios';
import { logInRequest, logInFail, logInSuccess } from './syncActions';
import { dashboardHoldingsRequest, dashboardHoldingsSuccess, dashboardFundsListSuccess } from './syncActions';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import config from '../data/firebaseConfig.json';
firebase.initializeApp(config);

export function fetchLogIn(email, password) {
  return async (dispatch) => {
    dispatch(logInRequest(email, password));
    try {
      if(email && password){
        let idToken = '';
        await firebase.auth().signInWithEmailAndPassword(email, password);
        let currentUser = await firebase.auth().currentUser;
        if (currentUser) {
          idToken = await currentUser.getIdToken();
          dispatch(logInSuccess(idToken));
        }
      } else {
        dispatch(logInFail("Empty Fields"));
      }
    } catch(error) {
      dispatch(logInFail(error.message));
    }
  }
}

export function fetchDashboard (displayCategory, target) {
  return async (dispatch, getState) => {
    const state = getState();
    let idToken = state.logIn.idToken;
    try{
      if (!idToken){ throw new Error("no token"); }
      const axiosInstance = axios.create({
        baseURL: 'https://fund.robertzhao.com/',
        headers: {'Authorization': idToken}
      });
      if (displayCategory === "holdings"){
        let holdingsResponse = await axiosInstance.get(`apis/getHoldings?user=${target}`);
        let holdingsObject = holdingsResponse.data;
        let fundsList = Object.keys(holdingsObject);
        dispatch(dashboardFundsListSuccess(fundsList));
        let holdingsOverview = [];
        let fundsOverview = {};
        dispatch(dashboardHoldingsRequest(target));
        for (let fundId of fundsList) {
          holdingsOverview.push({
            currency: holdingsObject[fundId].currency,
            fundId,
            shares: holdingsObject[fundId].share
          });
          let fundResponse = await axiosInstance.get(`apis/getFund?&fund=${fundId}`);
          let currentPrice = fundResponse.data;
          fundsOverview[fundId] = {
            currentPrice,
            initialPrice: holdingsObject[fundId].initialPrice
          };
        }
        dispatch(dashboardHoldingsSuccess(target, holdingsOverview, fundsOverview));
      } else if (displayCategory === "fund"){
        
      } else{ throw new Error("display error") }
    } catch(error) {
      dispatch(logInFail("expired token, log in again"));
    }
  }
}