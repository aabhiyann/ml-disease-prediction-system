import './styles/globals.css';
import HomePageModern from './components/HomePageModern';
import DiseaseFormModern from './components/DiseaseFormModern';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <HomePageModern />
          </Route>
          <Route exact path="/form">
            <DiseaseFormModern />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
