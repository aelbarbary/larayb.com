import React, { Component } from 'react';
import Home from './components/Home/index';
import OfferForm from './components/Offer/Form';
import OfferDetails from './components/Offer/Details';
import MyAccount from './components/MyAccount/index';
import Root from './components/Root.js';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './styles/global.sass';
import ReactGA from 'react-ga';


ReactGA.initialize('UA-131219503-1');
ReactGA.pageview('/');

class App extends Component {

  render() {

    return (
        <Router>
            <Root>
              <Switch>
                <Route path="/offer/:id/details" component={OfferDetails}></Route>
                <Route path="/offer/:id" component={OfferForm}></Route>
                <Route path="/offer" component={OfferForm}></Route>
                <Route path="/myaccount/" component={MyAccount}></Route>
                <Route path="/search/:term" component={Home}></Route>
                <Route path="/" component={Home}></Route>
              </Switch>
            </Root>
        </Router>
    );
  }
}

export default App;
