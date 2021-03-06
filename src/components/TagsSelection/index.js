import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Tag } from '../../proptypes';

export default class TagsSelection extends Component {
	static defaultProps = {
		multiSelection: true
	};

	static propTypes = {
		onChange: PropTypes.func,
		tags: PropTypes.arrayOf(PropTypes.shape(Tag)),
		selectedTags: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
		multiSelection: PropTypes.bool
	};

	render() {
		const { tags, selectedTags, onChange, multiSelection } = this.props;
		return (
			<Dropdown
				onChange={onChange}
				placeholder={`Select ${multiSelection ? 'Tags' : 'a Tag'}`}
				fluid
				multiple={multiSelection}
				value={selectedTags}
				search
				selection
				options={tags.map(tag => ({
					key: tag.id,
					value: tag.name,
					text: tag.parent ? tags.find(t => t.id === tag.parent).name + '/' + tag.name : tag.name
				}))}
			/>
		);
	}
}
