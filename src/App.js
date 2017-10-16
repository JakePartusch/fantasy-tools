import React, { Component } from 'react';
import './App.css';
import { FantasyFootballApi } from './FantasyFootballApi';
import { Segment, Table, Header, Image, Grid, Container, Form, Button, Loader, Modal, Icon, Message } from 'semantic-ui-react';
import '../node_modules/semantic-ui-css/semantic.min.css';

const getParams = query => {
  if (!query) {
    return { };
  }

  return (query
    .split('?')[1]
    .split('&')
    .reduce((params, param) => {
      let [ key, value ] = param.split('=');
      params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
      return params;
    }, { }));
};

class App extends Component {
  
  constructor() {
    super();
    this.state = {
      rankings: [],
      leagueId: "",
      loading: false,
      modalOpen: true,
      error: false
    }
    this.api = new FantasyFootballApi();
  }

  async onSubmit() {
    let params = getParams(this.state.leagueUrl);
    this.setState({rankings: [], loading: true, modalOpen: false})
    try {
      let rankings = await this.api.getPowerRankings(params.leagueId, params.seasonId);
      const userData = await this.api.getUserData(params.leagueId, params.seasonId);
      rankings = rankings.map(team => ({
        ...userData.find(user => user.id === team.id),
        ...team
      }));
      this.setState({rankings, loading: false, error: false});
    } catch(e) {
      console.log(e);
      this.setState({rankings: [], loading: false, modalOpen: true, error: true})
    }
  }

  handleLeagueUrlChange = e => {
    this.setState({leagueUrl: e.target.value})
  }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  render() {
    return (
      <div className="App">
        <Modal
          open={this.state.modalOpen}
          onClose={this.handleClose}
          closeOnDimmerClick={false}
          basic
          size='tiny'
        >
          <Header icon='write' content='Enter ESPN League URL' />
          <Modal.Content>
            {this.state.error && <Message negative>
              <Message.Header>We're sorry, something went wrong. Please try again.</Message.Header>
            </Message>}
            <Form onSubmit={this.onSubmit.bind(this)}>
              <Form.Field>
                <input 
                  placeholder='http://games.espn.com/ffl/leagueoffice?leagueId=123456&seasonId=2017' 
                  value={this.state.leagueUrl} 
                  onChange={this.handleLeagueUrlChange}/>
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color='green' type='submit' onClick={this.onSubmit.bind(this)} inverted>
              <Icon name='checkmark' /> Submit
            </Button>
          </Modal.Actions>
        </Modal>
        <Loader active={this.state.loading}/>
        <Container>
        <Grid centered>
          <Grid.Row>
          </Grid.Row>
          {this.state.rankings.length > 0 && <Grid.Row>
          <Grid.Column computer={8} tablet={8} mobile={16}>
            <a href="#" onClick={this.handleOpen}>Switch to a different League</a>
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
                  { this.state.rankings.map(team =>
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
        </Container>
      </div>
    );
  }
}

export default App;
