import React, { Component } from 'react';
import { Grid, Segment, Header, Table, Image, Loader, Button, Responsive, Icon, Popup } from 'semantic-ui-react';
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
            rankings: [],
            showDetailedView: false
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
                    const winData = week.find(user => user.id === team.id);
                    return {
                        weeklyWinData : winData && winData.wins + winData.losses > 0 ? team.weeklyWinData.push(winData): team.weeklyWinData,
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

    onDetailedViewClick() {
        this.setState((prevState) => ({
            showDetailedView: !prevState.showDetailedView
        }));
    }

    switchLeague() {
        this.props.history.push("/");
    }

    displayWeeklyHeaders(rankings) {
        return rankings[0].weeklyWinData.map((data, i) => <Table.HeaderCell>{i+1}</Table.HeaderCell>)
    }

    displayWeeklyRecords(team) {
        return team.weeklyWinData.map(data => 
            <Table.Cell positive={data.wins >= data.losses} negative={data.wins < data.losses}>
                {data.wins} - {data.losses}
            </Table.Cell>)
    }

    getDiff(overallStanding, calculatedStanding) {
        const diff = overallStanding - calculatedStanding;
        if(diff > 0) {
            return <div><Icon name="arrow circle up" color="green"/>{diff}</div>
        } else if (diff < 0) {
            return <div><Icon name="arrow circle down" color="red"/>{diff}</div>
        } else {
            return <div>-</div>
        }
        
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
                <Grid.Column 
                    computer={this.state.showDetailedView ? 14 : 8} 
                    mobile={15}>
                    <Grid.Row>
                        <Link to="/">Switch to a different League</Link>
                        <Button 
                            floated='right'
                            className="mobile-hide" 
                            onClick={() => this.onDetailedViewClick()}
                            content={this.state.showDetailedView ? "Show Simple View" : "Show Detailed View" }
                        ></Button>
                    </Grid.Row>
                    <Segment>
                    <Header>Power Rankings {this.props.match.params.seasonId}</Header>
                    <Table celled unstackable definition striped size="small">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Team</Table.HeaderCell>
                                {this.state.showDetailedView && this.displayWeeklyHeaders(rankings)}
                                <Table.HeaderCell>
                                    <span style={{paddingRight: "0.5rem"}}>Total</span>
                                    <Popup
                                        trigger={<Icon name='info' circular size="small"/>}
                                        content='A simulation of every possible matchup this season.'
                                    />
                                </Table.HeaderCell>
                                <Table.HeaderCell>Actual</Table.HeaderCell>
                                <Table.HeaderCell>Diff</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                        { rankings.map((team, index) =>
                        <Table.Row>
                            <Table.Cell>
                            <Header as='h4' image>
                                <Image className="mobile-hide" src={team.logoUrl} shape='rounded' size='mini' />
                                <Header.Content>
                                    {team.name}
                                <Header.Subheader>{team.owner}</Header.Subheader>
                                </Header.Content>
                            </Header>
                            </Table.Cell>
                            {this.state.showDetailedView && this.displayWeeklyRecords(team)}
                            <Table.Cell>
                                <strong>{team.wins} - {team.losses}</strong>
                            </Table.Cell>
                            <Table.Cell>
                                {team.overallWins} - {team.overallLosses}
                            </Table.Cell>
                            <Table.Cell>
                                {this.getDiff(team.overallStanding, index +1 )}
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