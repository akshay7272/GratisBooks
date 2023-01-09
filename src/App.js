import React from 'react';
import {Link, Route, Routes, BrowserRouter as Router} from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import DonateBook from './DonateBook';

function App() {
  return (
    <div className="App">
      Header
      <br/>
      <br/>
       <Router>
        <div>
          <Link to="/" style={{marginRight: 10}}>Home</Link>
          <Link to="/donate" style={{marginRight: 10}}>Donate</Link>
          <Link to="/login">Login</Link>
        </div>
         <br/>
          <Routes>
            <Route element={<Home/>} path="/"></Route>
            <Route element={<DonateBook/>} path="/donate"></Route>
            <Route element={<Login/>} path="/login"></Route>
          </Routes>

      </Router>
      <br/>
      <br/>
      Footer
    </div>
  );
}

export default App;
