export const LOG_IN_REQUEST = "LOG_IN_REQUEST";
export const LOG_IN_FAIL = "LOG_IN_FAIL";
export const LOG_IN_SUCCESS = "LOG_IN_SUCCESS";
export const DASHBOARD_HOLDINGS_REQUEST = "DASHBOARD_HOLDINGS_REQUEST";
export const DASHBOARD_HOLDINGS_SUCCESS = "DASHBOARD_HOLDINGS_SUCCESS";
export const DASHBOARD_FUNDSLIST_SUCCESS = "DASHBOARD_FUNDSLIST_SUCCESS";
export const DASHBOARD_FUND_REQUEST = "DASHBOARD_FUND_REQUEST";
export const DASHBOARD_FUND_SUCCESS = "DASHBOARD_FUND_SUCCESS";
export const DASHBOARD_INIT_LOAD = "DASHBOARD_INIT_LOAD";

export function logInRequest() {
  return {
    type: LOG_IN_REQUEST
  };
}

export function logInFail(errorMessage) {
  return {
    type: LOG_IN_FAIL,
    errorMessage
  };
}

export function logInSuccess(idToken) {
  return {
    type: LOG_IN_SUCCESS,
    idToken
  };
}

export function dashboardHoldingsRequest(currentHolder) {
  return {
    type: DASHBOARD_HOLDINGS_REQUEST,
    currentHolder
  };
}

export function dashboardHoldingsSuccess(currentHolder, holdingsOverview, fundsOverview) {
  return {
    type: DASHBOARD_HOLDINGS_SUCCESS,
    currentHolder,
    holdingsOverview,
    fundsOverview
  };
}

export function dashboardFundsListSuccess(fundsList) {
  return {
    type: DASHBOARD_FUNDSLIST_SUCCESS,
    fundsList
  };
}

export function dashboardFundRequest(currentFund) {
  return {
    type: DASHBOARD_FUND_REQUEST,
    currentFund
  };
}

export function dashboardFundSuccess(currentFund, fundDetails) {
  return {
    type: DASHBOARD_FUND_REQUEST,
    currentFund,
    fundDetails
  };
}

export function dashboardInitLoad() {
  return {
    type: DASHBOARD_INIT_LOAD
  };
}