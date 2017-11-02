import React, { Component } from 'react';
import { Grid, Segment, Header, Table, Image, Loader } from 'semantic-ui-react';
import { FantasyFootballApi } from '../api/FantasyFootballApi';
import { withRouter, Link } from 'react-router-dom';
import { cloneDeep } from 'lodash';

class PowerRankingsGrid extends Component {
    static propTypes = {};
    static defaultProps = {};

    constructor() {
        super();
        this.api = new FantasyFootballApi();
        this.state = {
            rankings: []
        }
    }

    async componentWillMount() {
        this.setState({loading: true})
        try {
            const userData = await this.api.getUserData(this.props.match.params.leagueId, this.props.match.params.seasonId);
            let weeklyWins = await this.api.getWeeklyWinsForSeason(this.props.match.params.leagueId, this.props.match.params.seasonId)
            let rankings = this.api.calculateSeasonWinTotal(cloneDeep(weeklyWins));
            rankings = rankings.map(team => ({
                ...userData.find(user => user.id === team.id),
                ...team,
                weeklyWinData: []
            }));
            weeklyWins = weeklyWins.filter(week => week.length);
            weeklyWins.forEach(week => {
                rankings = rankings.map(team => {
                    return {
                        weeklyWinData : team.weeklyWinData.push(week.find(user => user.id === team.id)),
                        ...team
                    }
                })
            })
            this.setState({rankings, loading:false})
        } catch(e) {
            console.log(e);
            this.props.history.push("/error");
        }
    }

    switchLeague() {
        this.props.history.push("/");
    }

    render() {
        const { rankings } = this.state;
        return (
        <div>
            <Loader active={this.state.loading}/>
            <Grid centered>
                <Grid.Row>
                </Grid.Row>
                {rankings.length > 0 && <Grid.Row>
                <Grid.Column computer={14} tablet={16} mobile={16}>
                    <Link to="/">Switch to a different League</Link>
                    <Segment>
                    <Header>Power Rankings {this.props.match.params.seasonId}</Header>
                    <Table basic='very' celled striped>
                        <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Team</Table.HeaderCell>
                            {rankings[0].weeklyWinData.map((data, i) => <Table.HeaderCell>{i+1}</Table.HeaderCell>)}
                            <Table.HeaderCell>Total</Table.HeaderCell>
                        </Table.Row>
                        </Table.Header>

                        <Table.Body>
                        { rankings.map(team =>
                        <Table.Row>
                            <Table.Cell>
                            <Header as='h4' image>
                                <Image src={team.logoUrl} shape='rounded' size='mini' />
                                <Header.Content>
                                    {team.name}
                                <Header.Subheader>{team.owner}</Header.Subheader>
                                </Header.Content>
                            </Header>
                            </Table.Cell>
                            {team.weeklyWinData.map(data => <Table.Cell positive={data.wins >= data.losses} negative={data.wins < data.losses}>
                                {data.wins} - {data.losses}
                            </Table.Cell>)}
                            <Table.Cell>
                                <strong>{team.wins} - {team.losses}</strong>
                            </Table.Cell>
                        </Table.Row>
                        )}
                        </Table.Body>
                    </Table>
                    </Segment>
                </Grid.Column>
                </Grid.Row>}
            </Grid>
        </div>
        )
    }
}
export default withRouter(PowerRankingsGrid)