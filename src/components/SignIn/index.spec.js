import React from 'react';
import { Provider } from 'react-redux';
import SignIn from '../../components/SignIn';
import renderer from 'react-test-renderer';
import store from '../../store';

test('SignIn Component is generated', () => {
	const component = renderer.create(
		<Provider store={store}>
			<SignIn />
		</Provider>
	);

	let tree = component.toJSON();
	expect(tree.type).toBe('div');
});
