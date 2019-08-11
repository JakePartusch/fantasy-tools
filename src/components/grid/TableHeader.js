import React from 'react';
import { Table, Popup, Icon } from 'semantic-ui-react';

const TableHeader = ({ showDetailedView, rankings }) => {
  const displayWeeklyHeaders = rankings => {
    return rankings[0].wins.map((win, i) => (
      <Table.HeaderCell key={`rankings-${i}`} textAlign="center">
        {i + 1}
      </Table.HeaderCell>
    ));
  };

  return (
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell textAlign="center">Team</Table.HeaderCell>
        {showDetailedView && displayWeeklyHeaders(rankings)}
        <Table.HeaderCell textAlign="center">
          <span style={{ paddingRight: '0.5rem' }}>Total</span>
          <Popup
            trigger={<Icon name="info" circular size="small" />}
            content="A simulation of every possible matchup this season."
          />
        </Table.HeaderCell>
        <Table.HeaderCell textAlign="center">Actual</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
  );
};

export default TableHeader;
