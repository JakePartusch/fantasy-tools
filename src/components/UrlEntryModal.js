import React, { Component } from 'react';
import { Modal, Header, Message, Form, Icon, Button } from 'semantic-ui-react';
import { getParams } from '../util/utils';
import {withRouter} from 'react-router-dom'
import validUrl from 'valid-url';

class UrlEntryModal extends Component {

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
        if(validUrl.isUri(this.state.leagueUrl)) {
            let params = getParams(this.state.leagueUrl);
            const {leagueId, seasonId} = params;
            this.props.history.push(`/espn/${leagueId}/${seasonId}`);
        } else {
            console.log('invalid URI')
            this.props.history.push(`/error`);
        }
    }

    render() {
        const { error } = this.props.match.params;
        return (
            <Modal
            open={true}
            closeOnDimmerClick={false}
            basic
            size='tiny'
            >
            <Header icon='write' content='Enter ESPN League URL' />
            <Modal.Content>
                {error && <Message negative>
                <Message.Header>We're sorry, something went wrong. Please try again.</Message.Header>
                </Message>}
                <Form onSubmit={this.onSubmit.bind(this)}>
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
export default withRouter(UrlEntryModal);