import React, { Component } from 'react';
import { func, bool } from 'prop-types';
import { Modal, Header, Message, Form, Icon, Button } from 'semantic-ui-react';
import { getParams } from '../util/utils';

export default class UrlEntryModal extends Component {

    static propTypes = {
        modalOpen: bool.isRequired,
        handleClose: func.isRequired,
        error: bool.isRequired,
        onSubmit: func.isRequired
    }
    static defaultProps = {}

    constructor() {
        super();
        this.state = {
            leagueUrl: ''
        }
    }

    handleLeagueUrlChange = e => {
        this.setState({leagueUrl: e.target.value})
    }

    onSubmit() {
        let params = getParams(this.state.leagueUrl);
        this.props.onSubmit(params);
    }

    render() {
        const { modalOpen, handleClose, error, onSubmit } = this.props;
        return (
            <Modal
            open={modalOpen}
            onClose={handleClose}
            closeOnDimmerClick={false}
            basic
            size='tiny'
            >
            <Header icon='write' content='Enter ESPN League URL' />
            <Modal.Content>
                {error && <Message negative>
                <Message.Header>We're sorry, something went wrong. Please try again.</Message.Header>
                </Message>}
                <Form onSubmit={onSubmit.bind(this)}>
                <Form.Field>
                    <input 
                    placeholder='http://games.espn.com/ffl/leagueoffice?leagueId=123456&seasonId=2017' 
                    value={this.state.leagueUrl} 
                    onChange={this.handleLeagueUrlChange}/>
                </Form.Field>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button color='green' type='submit' onClick={this.onSubmit.bind(this)} inverted>
                <Icon name='checkmark' /> Submit
                </Button>
            </Modal.Actions>
            </Modal>
        )
    }
}