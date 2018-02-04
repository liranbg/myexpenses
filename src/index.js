import 'semantic-ui-css/semantic.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import MainApp from './pages/MainApp';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import store, { history } from './store';


class Root extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <MainApp/>
        </ConnectedRouter>
      </Provider>
    );
  }
}

const render = () => ReactDOM.render(<Root/>, document.getElementById('root'));

render();

if (module.hot) {
  // module.hot.dispose(() => ({}));
  module.hot.accept(() => ({}));
}
