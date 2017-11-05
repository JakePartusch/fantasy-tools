import React, { Component } from 'react';
import { Grid, Segment, Header, Table, Image, Loader, Button, Responsive, Icon, Popup } from 'semantic-ui-react';
import { FantasyFootballApi } from '../api/FantasyFootballApi';
import { withRouter, Link } from 'react-router-dom';
import { cloneDeep } from 'lodash';
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
            const rankings = await this.api.getPowerRankings(leagueId, seasonId)
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

    displayWeeklyRecords(team) {
        return team.weeklyWinData.map(data => 
            <Table.Cell positive={data.wins >= data.losses} negative={data.wins < data.losses}>
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
                                            <Table.Row>
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