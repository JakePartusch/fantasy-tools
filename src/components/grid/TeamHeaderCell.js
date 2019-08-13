import React from 'react';
import { Table, Header, Image } from 'semantic-ui-react';

const TeamHeaderCell = ({ team }) => {
  return (
    <Table.Cell>
      <Header as="h4" image>
        <Image className="mobile-hide" src={team.logo} shape="rounded" size="mini" />
        <Header.Content>
          {team.name}
          <Header.Subheader>{team.owner}</Header.Subheader>
        </Header.Content>
      </Header>
    </Table.Cell>
  );
};

export default TeamHeaderCell;
