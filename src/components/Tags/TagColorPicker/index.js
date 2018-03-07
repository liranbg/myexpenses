import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CirclePicker } from 'react-color';
import { Header, Container, ModalActions, ModalContent, Button, Modal } from 'semantic-ui-react';
import { colorsPalette } from '../../../constants';

class TagColorPicker extends Component {
	static propTypes = {
		selectedColor: PropTypes.string.isRequired,
		onSelectTagColor: PropTypes.func.isRequired,
		active: PropTypes.bool,
		loading: PropTypes.bool
	};

	getCurrentColor() {
		return !!this.state.tempColor.length ? this.state.tempColor : this.props.selectedColor;
	}

	state = {
		tempColor: ''
	};

	close = (e, { positive }) => {
		if (
			positive &&
			!!this.state.tempColor.length &&
			this.props.selectedColor !== this.state.tempColor
		) {
			this.props.onSelectTagColor(this.state.tempColor);
		}
		this.setState({ tempColor: '' });
		this.modal.setState({
			open: false
		});
	};

	render() {
		return (
			<Modal
				ref={modal => (this.modal = modal)}
				size={'mini'}
				trigger={
					<Button
						active={this.props.active}
						loading={this.props.loading}
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
					style={{
						backgroundColor: this.getCurrentColor()
					}}
				/>
				<ModalContent>
					<Container
						style={{
							display: 'flex',
							justifyContent: 'center'
						}}
					>
						<CirclePicker
							colors={[...colorsPalette, '#7D7D7D']}
							color={this.getCurrentColor()}
							onChangeComplete={color => this.setState({ tempColor: color.hex })}
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
					<Button
						onClick={this.close}
						negative
						icon={'cancel'}
						content={'Cancel'}
						compact
						size={'small'}
					/>
				</ModalActions>
			</Modal>
		);
	}
}

export default TagColorPicker;
