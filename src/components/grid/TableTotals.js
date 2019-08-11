import React from 'react';
import { Table } from 'semantic-ui-react';

const TableTotals = ({ team }) => {
  return (
    <>
      <Table.Cell textAlign="center">
        <strong>
          {team.totalWins} - {team.totalLosses}
        </strong>
      </Table.Cell>
      <Table.Cell textAlign="center">
        {team.actualRecord.wins} - {team.actualRecord.losses} - {team.actualRecord.ties}
      </Table.Cell>
    </>
  );
};

export default TableTotals;
