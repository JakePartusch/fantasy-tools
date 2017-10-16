import React, { Component } from 'react';
import { func, arrayOf, object } from 'prop-types';
import { Grid, Segment, Header, Table, Image} from 'semantic-ui-react';

export default class PowerRankingsGrid extends Component {
    static propTypes = {
        handleOpen: func.isRequired,
        rankings: arrayOf(object).isRequired
    };
    static defaultProps = {};

    render() {
        const { handleOpen, rankings } = this.props;
        return (
            <Grid centered>
            <Grid.Row>
            </Grid.Row>
            {rankings.length > 0 && <Grid.Row>
            <Grid.Column computer={8} tablet={8} mobile={16}>
                <a href="#" onClick={handleOpen}>Switch to a different League</a>
                <Segment>
                <Header>Power Rankings 2017</Header>
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
        )
    }
}