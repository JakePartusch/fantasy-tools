import React, { useState } from 'react';
import { Modal, Header, Message, Form, Icon, Button } from 'semantic-ui-react';
import { getParams } from '../util/utils';
import { withRouter } from 'react-router-dom';
import validUrl from 'valid-url';

const UrlEntryModal = ({ history, match }) => {
  const [leagueUrl, setLeagueUrl] = useState();

  const handleLeagueUrlChange = e => {
    setLeagueUrl(e.target.value);
  };

  const onSubmit = () => {
    if (validUrl.isUri(leagueUrl)) {
      let params = getParams(leagueUrl);
      const { leagueId, seasonId = '2019' } = params;
      navigateToRankings(leagueId, seasonId);
    } else {
      console.log('invalid URI');
      history.push(`/error`);
    }
  };

  const navigateToRankings = (leagueId, seasonId) => {
    history.push(`/espn/${leagueId}/${seasonId}`);
  };
  const { error } = match.params;
  return (
    <Modal open={true} closeOnDimmerClick={false} basic size="tiny">
      <Header icon="write" content="Enter ESPN League URL" />
      <Modal.Content>
        {error && (
          <Message negative>
            <Message.Header>We're sorry, something went wrong. Please try again.</Message.Header>
          </Message>
        )}
        <Form onSubmit={() => onSubmit()}>
          <Form.Field>
            <input
              placeholder="https://fantasy.espn.com/football/team?leagueId=551785&seasonId=2018"
              value={leagueUrl}
              onChange={handleLeagueUrlChange}
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color="green" type="submit" onClick={() => onSubmit()} inverted>
          <Icon name="checkmark" /> Submit
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default withRouter(UrlEntryModal);
