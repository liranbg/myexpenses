import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { firebaseReducer } from 'react-redux-firebase';
import expensesViewReducer from './expense/expense-view';
import ChartsViewReducer from './chart/chart-view';
import { firestoreReducer } from 'redux-firestore';

const expensesApp = combineReducers({
	expensesView: expensesViewReducer,
	chartsView: ChartsViewReducer,
	firebase: firebaseReducer,
	firestore: firestoreReducer,
	router: routerReducer
});

export default expensesApp;
