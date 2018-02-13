import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CirclePicker } from 'react-color';

import {
  Header,
  Container,
  ModalActions,
  ModalContent,
  Button,
  Modal
} from 'semantic-ui-react';

class TagColorPicker extends Component {
  close = () => this.modal.setState({ open: false });

  render() {
    const { selectedColor, onSelectTagColor } = this.props;
    return (
      <Modal
        ref={modal => (this.modal = modal)}
        size={'mini'}
        trigger={
          <Button
            primary={true}
            floated={'right'}
            compact={true}
            size={'small'}
            icon="paint brush"
          />
        }
        closeIcon
      >
        <Header
          icon="paint brush"
          content="Pick Color"
          style={{ backgroundColor: selectedColor }}
        />
        <ModalContent>
          <Container style={{ display: 'flex', justifyContent: 'center' }}>
            <CirclePicker
              color={selectedColor}
              onChangeComplete={color => onSelectTagColor(color.hex)}
            />
          </Container>
        </ModalContent>
        <ModalActions>
          <Button
            onClick={this.close}
            positive
            icon={'checkmark'}
            content={'Done'}
            compact
            size={'small'}
          />
        </ModalActions>
      </Modal>
    );
  }
}

TagColorPicker.propTypes = {
  selectedColor: PropTypes.string.isRequired,
  onSelectTagColor: PropTypes.func.isRequired
};

export default TagColorPicker;
