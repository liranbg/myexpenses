import { FILTER_EXPENSES_BY_TAG, FILTER_EXPENSES_BY_NAME } from '../../actions';

let INITIAL_STATE = {
	selectedTags: [],
	expenseName: ''
};

const expensesViewReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case FILTER_EXPENSES_BY_NAME:
			return {
				...state,
				expenseName: action.payload.expenseName
			};
		case FILTER_EXPENSES_BY_TAG:
			return {
				...state,
				selectedTags: [...action.payload.tags]
			};
		default:
			return state;
	}
};

export default expensesViewReducer;
