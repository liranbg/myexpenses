import React from 'react';
import { Tag } from '../../../proptypes';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

const TagsDropDownSelection = props => {
	return (
		<Dropdown
			onChange={props.onChange}
			compact
			inline
			labeled
			placeholder="Tag"
			search
			defaultValue={'Untagged'}
			options={props.tags.map(tag => ({
				key: tag.id,
				value: tag.name,
				text: tag.parent ? props.tags.find(t => t.id === tag.parent).name + '/' + tag.name : tag.name
			}))}
		/>
	);
};
TagsDropDownSelection.propTypes = {
	tags: PropTypes.arrayOf(PropTypes.shape(Tag)),
	onChange: PropTypes.func
};

export default TagsDropDownSelection;
