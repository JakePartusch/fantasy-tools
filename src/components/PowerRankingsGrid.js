import React, { Component } from 'react';
import { Grid, Segment, Header, Table, Image, Loader } from 'semantic-ui-react';
import { FantasyFootballApi } from '../api/FantasyFootballApi';
import { withRouter, Link } from 'react-router-dom';

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
            let rankings = await this.api.getPowerRankings(this.props.match.params.leagueId, this.props.match.params.seasonId);
            const userData = await this.api.getUserData(this.props.match.params.leagueId, this.props.match.params.seasonId);
            rankings = rankings.map(team => ({
                ...userData.find(user => user.id === team.id),
                ...team
            }));
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
                <Grid.Column computer={8} tablet={8} mobile={16}>
                    <Link to="/">Switch to a different League</Link>
                    <Segment>
                    <Header>Power Rankings {this.props.match.params.seasonId}</Header>
                    <Table basic='very' celled unstackable>
                        <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Team</Table.HeaderCell>
                            <Table.HeaderCell>Wins</Table.HeaderCell>
                            <Table.HeaderCell>Losses</Table.HeaderCell>
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
                            <Table.Cell>
                                {team.wins}
                            </Table.Cell>
                            <Table.Cell>
                                {team.losses}
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