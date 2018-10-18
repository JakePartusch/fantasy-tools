import React, { Component } from 'react';
import { Modal, Form, Button, List } from 'semantic-ui-react';
import axios from 'axios';
import {withRouter} from 'react-router-dom'


class LoginModal extends Component {

    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            loading: false,
            teams: []
        }
    }

    handleUsernameChange = e => {
        this.setState({username: e.target.value})
    }

    handlePasswordChange = e => {
        this.setState({password: e.target.value})
    }

    onLogin = async () => {
        const body = {
            username: this.state.username,
            password: this.state.password
        }
        const loginResponse = await axios.post('/.netlify/functions/login', body)
        const { swid, s2 } = loginResponse.data;
        const getTeamsResponse = await axios.post('.netlify/functions/getTeams', { swid })
        this.setState({ teams: getTeamsResponse.data, username: '', password: '', authentication: { swid, s2 } })
        window.localStorage.setItem('authentication', JSON.stringify({swid, s2}));

    }

    navigateToTeam = (team) => {
        const {leagueId, seasonId} = team
        this.props.history.push(`/espn/${leagueId}/${seasonId}`, { authentication: this.state.authentication });
    }

    render() {
        if(this.state.teams.length > 0) {
            return <Modal 
                open={true}
                closeOnDimmerClick={false}
                size='tiny'>
                <Modal.Header>Teams</Modal.Header>
                <Modal.Content>
                    <List divided relaxed>
                        {this.state.teams.map(team => (
                            <List.Item>
                                <List.Content>
                                    <List.Header as='a' onClick={() => this.navigateToTeam(team)}>{team.leagueName}</List.Header>
                                </List.Content>
                            </List.Item>
                        ))}

                    </List>
                </Modal.Content>
            </Modal>
        }
        return (
            <Modal                 
                open={true}
                closeOnDimmerClick={false}
                size='tiny'>
                <Modal.Header>ESPN Login</Modal.Header>
                <Modal.Content >
                    <Form onSubmit={this.onLogin}>
                        <Form.Field>
                            <label>Username</label>
                            <input type="text" id="username" name="username" value={this.state.username} onChange={this.handleUsernameChange} />
                        </Form.Field>
                        <Form.Field>
                            <label>Password</label>
                            <input type="password" value={this.state.password} onChange={this.handlePasswordChange} />
                        </Form.Field>
                        <Button type='submit'>Submit</Button>
                    </Form>
                </Modal.Content>
            </Modal>
        )
    }
}

export default withRouter(LoginModal);