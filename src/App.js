import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import NavBar from './components/NavBar';
import Submit from './components/pages/Submit';
import Display from './components/pages/Display';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBFCsvzIs_TO26c9BXBEE-Z-XM2bCAzi9A",
  authDomain: "leap-project-12740.firebaseapp.com",
  projectId: "leap-project-12740",
  storageBucket: "leap-project-12740.appspot.com",
  messagingSenderId: "849175356722",
  appId: "1:849175356722:web:417fe8d44516dced59632b",
  measurementId: "G-64ZFZZVSXM"
};

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
