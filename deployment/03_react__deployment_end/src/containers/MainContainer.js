import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import NavBar from '../components/NavBar.js';
import PirateContainer from './PirateContainer';

const MainContainer = () => {

    return (
      <Router>
      <>
      <NavBar/>
      <Switch>
        <Route path="/pirates" component={PirateContainer} />
      </Switch>
      </>
      </Router>
    )
}

export default MainContainer;