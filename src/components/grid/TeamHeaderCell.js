import React, { Component } from 'react';
import { object } from 'prop-types';
import { Table, Header, Image } from 'semantic-ui-react';

export default class TeamHeaderCell extends Component {
    static propTypes = {
        team: object.isRequired
    }

    render() {
        const { team } = this.props;
        return (
            <Table.Cell>
                <Header as='h4' image>
                    <Image className="mobile-hide" src={team.logoUrl} shape='rounded' size='mini' />
                    <Header.Content>
                        {team.name}
                    <Header.Subheader>{team.owner}</Header.Subheader>
                    </Header.Content>
                </Header>
            </Table.Cell>
        )
    }
}