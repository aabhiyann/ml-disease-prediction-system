import './App.css';
import HomePage from './components/HomePage';
import DiseaseForm from './components/DiseaseForm';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path="/form">
            <DiseaseForm />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
