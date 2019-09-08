import { combineReducers } from 'redux';
import { LOG_IN_REQUEST, LOG_IN_FAIL, LOG_IN_SUCCESS } from './syncActions';
import { DASHBOARD_HOLDINGS_REQUEST, DASHBOARD_HOLDINGS_SUCCESS,DASHBOARD_FUNDSLIST_SUCCESS,
   DASHBOARD_FUND_REQUEST, DASHBOARD_FUND_SUCCESS, DASHBOARD_INIT_LOAD } from './syncActions';

function logIn(
  state = {
    isLoggedIn : false,
    isFetching: false,
    idToken: '',
    errorMessage: ''
  }, action
) {
  switch (action.type) {
    case LOG_IN_REQUEST :
      return { ...state, isFetching: true };
    case LOG_IN_FAIL :
      return ({
              isFetching: false,
              errorMessage: action.errorMessage,
              isLoggedIn: false,
              idToken: ''
            });
    case LOG_IN_SUCCESS :
      return ({
              isFetching: false,
              errorMessage: '',
              isLoggedIn: true,
              idToken: action.idToken
      });
    default:
      return state;
  }
}

const dashBoardDefaultState = {
  dashBoardDisplay : {
    isInit: true,
    isFetching: true,
    onDisplay: {
      'category' : '',
      'target' : ''
    }
  },
  holdings : {
    currentHolder: '',
    holdingsOverview : [{ }],
    fundsOverview : { }
  },
  fund: {
    currentFund : '',
    fundDetails : { }
  },
  fundsList : []
}

function dashboard(state = dashBoardDefaultState, action) {
  switch (action.type){
    case DASHBOARD_HOLDINGS_REQUEST:
      return {
        ...state,
        dashBoardDisplay: {
          ...state.dashBoardDisplay,
          isFetching : true,
          onDisplay : {
            ...state.dashBoardDisplay.onDisplay,
            'category' : 'holdings',
            'target' : action.currentHolder
          }
        }
      };
    case DASHBOARD_HOLDINGS_SUCCESS:
      return {
        ...state,
        dashBoardDisplay :{
          ...state.dashBoardDisplay,
          isFetching : false
        },
        holdings : {
          ...state.holdings,
          currentHolder : action.currentHolder,
          holdingsOverview : action.holdingsOverview,
          fundsOverview : action.fundsOverview
        }
      };
    case DASHBOARD_FUNDSLIST_SUCCESS:
      return {
        ...state,
        fundsList : action.fundsList
      };
    case DASHBOARD_FUND_REQUEST:
      return {
        ...state,
        dashBoardDisplay: {
          ...state.dashBoardDisplay,
          isFetching : true,
          onDisplay : {
            ...state.dashBoardDisplay.onDisplay,
            'category' : 'fund',
            'target' : action.currentFund
          }
        }
      };
    case DASHBOARD_FUND_SUCCESS:
      return {
        ...state,
        fund : {
          ...state.fund,
          currentFund : action.currentFund,
          fundDetails : action.fundDetails
        }
      };
    case DASHBOARD_INIT_LOAD:
      return {
        ...state,
        dashBoardDisplay: {
          ...state.dashBoardDisplay,
          isInit : false
        }
      };
    default:
      return state;
  }
}

const rootReducer = combineReducers({ logIn, dashboard });

export default rootReducer;

