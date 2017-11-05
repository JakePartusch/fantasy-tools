import React, { Component } from 'react';
import { bool, arrayOf, object } from 'prop-types';
import { Table, Popup, Icon } from 'semantic-ui-react';

export default class TableHeader extends Component {
    static propTypes = {
        showDetailedView : bool.isRequired,
        rankings : arrayOf(object)
    }

    displayWeeklyHeaders(rankings) {
        return rankings[0].weeklyWinData.map((data, i) => <Table.HeaderCell>{i+1}</Table.HeaderCell>)
    }

    render() {
        const { showDetailedView, rankings } = this.props;
        return (
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Team</Table.HeaderCell>
                    {showDetailedView && this.displayWeeklyHeaders(rankings)}
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
        )
    }
}  