import 'semantic-ui-css/semantic.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import React from 'react';
import ReactDOM from 'react-dom';
import MainApp from './screens/MainApp';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import store, { history } from './store';

class Root extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<ConnectedRouter history={history}>
					<MainApp />
				</ConnectedRouter>
			</Provider>
		);
	}
}

ReactDOM.render(<Root />, document.getElementById('root'));

if (module.hot) {
	module.hot.dispose(function() {
		// module is about to be replaced
	});

	module.hot.accept(function() {
		console.log('updated');
		// module or one of its dependencies was just updated
	});
}
