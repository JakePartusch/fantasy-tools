import React, { Component } from 'react';
import { bool, object, number } from 'prop-types';
import { Table, Icon } from 'semantic-ui-react';

export default class TableTotals extends Component {
    static propTypes = {
        team: object.isRequired,
        index: number.isRequired
    };

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
        const { team, index } = this.props;
        return ([
            <Table.Cell>
                <strong>{team.wins} - {team.losses}</strong>
            </Table.Cell>,
            <Table.Cell>
                {team.overallWins} - {team.overallLosses}
            </Table.Cell>,
            <Table.Cell>
                {this.getDiff(team.overallStanding, index +1 )}
            </Table.Cell> 
        ])
    }
}