import {Route, Switch } from 'react-router-dom';
import Home from './home';
import Register from './Registration/register';
import Login from './Login/login';
import './App.css';
import EmailBuilder from './EmailBuilder/EmailBuilder';

function App() {
  return (
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route exact path='/register' component={Register}/>
      <Route exact path='/login' component={Login}/>
      <Route exact path="/email-builder" component={EmailBuilder} />
    </Switch>
  );
}

export default App;
