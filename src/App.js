/** @jsx jsx */
import { jsx } from '@emotion/core';
import Home from './pages/home/Home';
import RankingsSimulator from './pages/rankings/RankingsSimulator';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import { ThemeProvider, StylesProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core';
import Navbar from './common/Navbar';
import Footer from './common/Footer';

const theme = createMuiTheme({
  typography: {
    h1: {
      fontSize: '3rem'
    }
  }
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <StylesProvider injectFirst>
        <div className="App">
          <Router>
            <div
              css={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '100vh'
              }}
            >
              <Navbar />
              <main>
                <Route exact path="/" component={Home} />
                <Route exact path="/rankings" component={RankingsSimulator} />
              </main>
              <Footer />
            </div>
          </Router>
        </div>
      </StylesProvider>
    </ThemeProvider>
  );
};

export default App;
