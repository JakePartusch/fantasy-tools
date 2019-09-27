import React, { Component } from 'react';
import PowerRankingsGrid from './components/PowerRankingsGrid';
import UrlEntryModal from './components/UrlEntryModal';
import Home from './pages/home/Home';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import '../node_modules/semantic-ui-css/semantic.min.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Route exact path="/" component={Home} />
            <Route exact path="/modal" component={UrlEntryModal} />
            <Route exact path="/:error" component={UrlEntryModal} />
            <Route exact path="/espn/:leagueId/:seasonId" component={PowerRankingsGrid} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
