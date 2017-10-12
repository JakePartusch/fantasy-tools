import React, { Component } from 'react';
import { arrayOf, object } from 'prop-types';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { getPowerRankings, getUserData } from './FantasyFootballApi';
import { Segment, Table, Header, Image, Grid, Container, Form, Button, Loader, Menu } from 'semantic-ui-react';
import '../node_modules/semantic-ui-css/semantic.min.css';

class App extends Component {
  
  constructor() {
    super();
    this.state = {
      rankings: [],
      leagueId: "",
      loading: false
    }
  }

  async onSubmit(e) {
    this.setState({rankings: [], loading: true})
    let rankings = await getPowerRankings(this.state.leagueId, '2017', 13);
    const userData = await getUserData(this.state.leagueId, '2017');
    rankings = rankings.map(team => ({
      ...userData.find(user => user.id === team.id),
      ...team
    }))
    this.setState({rankings, loading: false});
  }

  handleLeagueIdChange = e => {
    this.setState({leagueId: e.target.value})
  }

  render() {
    return (
      <div className="App">
        <Loader active={this.state.loading}/>
        <Container>
        <Grid centered>
          <Grid.Row>
            <Grid.Column computer={6} largeScreen={5} tablet={8} mobile={16}>
            <Segment>
              <Form onSubmit={this.onSubmit.bind(this)}>
                <Form.Field>
                  <label>League ID</label>
                  <input 
                    placeholder='123456' 
                    value={this.state.leagueId} 
                    onChange={this.handleLeagueIdChange}/>
                </Form.Field>
                <Button type='submit' primary>Submit</Button>
              </Form>
            </Segment>
            </Grid.Column>
          </Grid.Row>
          {this.state.rankings.length > 0 && <Grid.Row>
          <Grid.Column computer={6} largeScreen={5} tablet={8} mobile={16}>
            <Segment>
              <Header>Power Rankings</Header>
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
