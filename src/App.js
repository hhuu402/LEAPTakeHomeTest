import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import NavBar from './components/NavBar';
import Submit from './components/pages/Submit';
import Display from './components/pages/Display';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

function App() {
  return (
      <Router>
        <NavBar />
          <div className='content'>
            <Routes>
              <Route exact path='/' element={<Display />}/>
              <Route path='/submit' element={<Submit />}/>
            </Routes>
          </div>
      </Router>

  );
}

export default App;
