import React from 'react';
import { Provider } from 'react-redux';
import ExpenseCard from './index';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import store from '../../../store/index';

Enzyme.configure({ adapter: new Adapter() });

test('ExpenseCard Component is generated', async () => {
	const expense = {
		amount: 123,
		currency: 'ILS',
		date: new Date(),
		name: 'ד"ר פול שקשוקה',
		id: '50c281ffbd2aa1f11723a44b348eee4d',
		tag: 'Untagged'
	};
	const tags = [{ id: '3zW1pkwjUjK95ye2diwv', name: 'Untagged', color: '#fff' }];

	const component = renderer.create(
		<Provider store={store}>
			<ExpenseCard tags={tags} expense={expense} />
		</Provider>
	);
	// console.log(component.getInstance());
	let tree = component.toJSON();
	expect(tree.type).toBe('div');

	const expenseS = shallow(
		<Provider store={store}>
			<ExpenseCard store={store} tags={tags} expense={expense} />
		</Provider>,
		{ context: { store } }
	);
	const expCard = expenseS
		.dive()
		.dive()
		.dive()
		.instance();
	expect(expCard.setTag).not.toBeUndefined();

	// const a = await expCard.setTag(expense.name, expense.id, "Food", "test", true, true);
	// console.debug(a);
});
