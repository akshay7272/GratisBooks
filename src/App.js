import React from 'react';
import { Route, Routes, BrowserRouter as Router} from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Account from "./Account";
import DonateBook from './DonateBook';
import Signup from './register';
import Navbar from "./Navbar";
import Protected from "./Protected";
import Update from './update';
import Comments from "./Comments";
import UpdateBook from "./UpdateBook";
import { AuthContextProvider } from "./context/AuthContext";

function App() {
  return (
    <div className="App">
     <AuthContextProvider>
       <Router>
        <Navbar />
          <Routes>
            <Route element={<Protected><Home/></Protected>} path="/"></Route>
            <Route element={<Protected><DonateBook/></Protected>} path="/donate"></Route>
            <Route element={<Login/>} path="/login"></Route>
            <Route element={<Signup/>} path="/register"></Route>
            <Route element={<Comments />} path="/comments/:id"></Route>
            <Route element={<Protected><Account/></Protected>} path="/account"></Route>
            <Route element={<Protected><Update/></Protected>} path="/Update"></Route>
            <Route element={<UpdateBook />} path="/account/update/:id"></Route>
          </Routes>
      </Router>
      </AuthContextProvider>
      <br />
    </div>
  );
}

export default App;
