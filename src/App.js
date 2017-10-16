import React, { Component } from 'react';
import './App.css';
import { FantasyFootballApi } from './api/FantasyFootballApi';
import UrlEntryModal from './components/UrlEntryModal';
import PowerRankingsGrid from './components/PowerRankingsGrid';
import { Container, Loader } from 'semantic-ui-react';
import '../node_modules/semantic-ui-css/semantic.min.css';

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

  async onSubmit(params) {
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

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  render() {
    return (
      <div className="App">
        <UrlEntryModal
          onSubmit={this.onSubmit.bind(this)}
          modalOpen={this.state.modalOpen}
          handleClose={this.handleClose.bind(this)}
          error={this.state.error}
        />
        <Loader active={this.state.loading}/>
        <Container>
          <PowerRankingsGrid
            handleOpen={this.handleOpen.bind(this)}
            rankings={this.state.rankings}
          />
        </Container>
      </div>
    );
  }
}

export default App;
