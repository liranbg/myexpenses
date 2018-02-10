import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Button, Icon, Label } from 'semantic-ui-react';
import TagColorPicker from '../../components/TagColorPicker';

const TagSegment = ({
  tagId,
  tagName,
  tagColor,
  tagUses,
  onDeleteTag,
  onSelectUses,
  onSelectTagColor
}) => {
  return (
    <Segment
      key={tagId}
      style={{
        borderTopWidth: 2,
        borderTopStyle: 'solid',
        borderTopColor: tagColor
      }}
    >
      <Button
        tagid={tagId}
        compact
        negative
        disabled={!!tagUses}
        content={'Delete'}
        floated={'right'}
        icon={'trash'}
        size={'small'}
        onClick={onDeleteTag}
      />
      <Icon name="tag" /> {tagName}{' '}
      <Label circular as={'a'} onClick={onSelectUses}>
        {tagUses} uses
      </Label>
      <TagColorPicker
        onSelectTagColor={color => onSelectTagColor(color, tagId)}
        selectedColor={tagColor}
      />
    </Segment>
  );
};

TagSegment.propTypes = {
  tagId: PropTypes.string.isRequired,
  tagName: PropTypes.string.isRequired,
  tagColor: PropTypes.string.isRequired,
  tagUses: PropTypes.number.isRequired,
  onDeleteTag: PropTypes.func.isRequired,
  onSelectUses: PropTypes.func.isRequired,
  onSelectTagColor: PropTypes.func.isRequired
};

export default TagSegment;
