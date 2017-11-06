import React, { Component } from 'react';
import { Modal, Header, Message, Form, Icon, Button, Dropdown } from 'semantic-ui-react';
import { getParams } from '../util/utils';
import {withRouter} from 'react-router-dom'
import validUrl from 'valid-url';
import { keys, isEmpty } from 'lodash';
import { FantasyFootballApi } from '../api/FantasyFootballApi';

class UrlEntryModal extends Component {

    constructor() {
        super();
        this.api = new FantasyFootballApi();
        this.state = {
            leagueUrl: '',
            recentRankings: []
        }
    }

    async componentWillMount() {
        try {
           await this.parseLocalStorage();
        } catch(e) {
            console.log("Unable to retrieve items from local storage");
        }
    }

    async parseLocalStorage() {
        const recentRankings = this.getRecentTeams();
        const leagueKeys = keys(recentRankings);
        const leagueDatas = await Promise.all(leagueKeys.map(async key => {
            const leagueId = key.split('&')[0];
            const seasonId = key.split('&')[1]
            const leagueData = await this.api.getLeagueData(leagueId, seasonId)
            return {
                leagueId,
                seasonId,
                name: leagueData.name
            }    
        }));
        this.setState({recentRankings: leagueDatas});
    }

    handleLeagueUrlChange = e => {
        this.setState({leagueUrl: e.target.value})
    }

    onSubmit() {
        if(validUrl.isUri(this.state.leagueUrl)) {
            let params = getParams(this.state.leagueUrl);
            const {leagueId, seasonId} = params;
            this.navigateToRankings(leagueId, seasonId);
        } else {
            console.log('invalid URI')
            this.props.history.push(`/error`);
        }
    }

    navigateToRankings(leagueId, seasonId) {
        this.props.history.push(`/espn/${leagueId}/${seasonId}`);
    }

    getRecentTeams() {
        let recentRankings = window.localStorage.getItem('recent-rankings');
        recentRankings = recentRankings ? JSON.parse(recentRankings) : {};
        return recentRankings;
    }

    onRecentRankingSelection(recentRanking) {
        const { leagueId, seasonId } = recentRanking
        this.navigateToRankings(leagueId, seasonId);
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
                    { !isEmpty(this.state.recentRankings) && 
                        <Dropdown text='Recent Searches' icon='find' floating labeled button className='icon'>
                            <Dropdown.Menu>
                            <Dropdown.Header icon='tags' content='Leagues' />
                            <Dropdown.Divider />
                            {this.state.recentRankings.map(recentRanking => {
                                return (
                                    <Dropdown.Item key={recentRanking.leagueId} onClick={() => this.onRecentRankingSelection(recentRanking)}>{recentRanking.name}</Dropdown.Item>
                                )
                            })}
                            </Dropdown.Menu>
                        </Dropdown>
                    }
                    <Button color='green' type='submit' onClick={this.onSubmit.bind(this)} inverted>
                        <Icon name='checkmark' /> Submit
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}
export default withRouter(UrlEntryModal);