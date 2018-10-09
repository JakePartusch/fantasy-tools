import React, { Component } from 'react';
import { Grid, Segment, Header, Table, Loader, Button } from 'semantic-ui-react';
import axios from 'axios';
import { FantasyFootballApi } from '../api/FantasyFootballApi';
import { withRouter, Link } from 'react-router-dom';
import TableHeader from './grid/TableHeader';
import TableTotals from './grid/TableTotals';
import TeamHeaderCell from './grid/TeamHeaderCell';

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
            const { leagueId, seasonId } = this.props.match.params;
            let rankings;
            try {
                const body = {
                    leagueId,
                    seasonId
                }
                const response = await axios.post(`/.netlify/functions/powerRankings`, body)
                rankings = response.data;
            } catch(e) {
                console.error(e);
                rankings = await this.api.getPowerRankings(leagueId, seasonId);
            }
            let recentRankings = window.localStorage.getItem('recent-rankings');
            recentRankings = recentRankings ? JSON.parse(recentRankings) : {};
            recentRankings[`${leagueId}&${seasonId}`] = rankings;
            window.localStorage.setItem('recent-rankings', JSON.stringify(recentRankings));
            this.setState({rankings, loading:false})
        } catch(e) {
            console.log(e);
            this.props.history.push("/error");
        }
    }

    /*
     Should return a dark red for bad record and dark green for a good record,
     mediocre records should be light red/green
    */
    getHslCellColor(wins, losses) {
        const totalGames = losses + wins
        if(wins < losses) {
            const winPercentage = wins / totalGames;
            return `hsl(0, 65%,${(winPercentage + 0.5) * 100}%)`
        } else {
            const lossPercentage = losses / totalGames;
            return `hsl(100, 65%,${(lossPercentage + 0.4) * 100}%)`
        }
    }

    displayWeeklyRecords(team) {
        return team.weeklyWinData.map(data => 
            <Table.Cell style={{backgroundColor: this.getHslCellColor(data.wins, data.losses)}}>
                {data.wins} - {data.losses}
            </Table.Cell>)
    }

    onDetailedViewClick() {
        this.setState((prevState) => ({
            showDetailedView: !prevState.showDetailedView
        }));
    }

    switchLeague() {
        this.props.history.push("/");
    }

    render() {
        const { rankings } = this.state;
        return ([
            <Loader active={this.state.loading}/>,
            <Grid centered>
                {rankings.length > 0 && 
                    <Grid.Row>
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
                                />
                            </Grid.Row>
                            <Segment>
                                <Header>Power Rankings {this.props.match.params.seasonId}</Header>
                                <Table celled unstackable definition striped size="small">
                                    <TableHeader
                                        showDetailedView={this.state.showDetailedView}
                                        rankings={rankings}
                                    />
                                    <Table.Body>
                                        { rankings.map((team, index) =>
                                            <Table.Row key={team.id}>
                                                <TeamHeaderCell team={team} />
                                                {this.state.showDetailedView && this.displayWeeklyRecords(team)}
                                                <TableTotals 
                                                    showDetailedView={this.state.showDetailedView}
                                                    team={team}
                                                    index={index}
                                                />
                                            </Table.Row>
                                        )}
                                    </Table.Body>
                                </Table>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                }
            </Grid>
        ])
    }
}
export default withRouter(PowerRankingsGrid)