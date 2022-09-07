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
  apiKey: "AIzaSyBNY5PixK947f9BMqNiAmiVYliMOolsO0k",
  authDomain: "leap-project-d3f7c.firebaseapp.com",
  projectId: "leap-project-d3f7c",
  storageBucket: "leap-project-d3f7c.appspot.com",
  messagingSenderId: "916591176978",
  appId: "1:916591176978:web:0d11c8d61fc36285ba97cb",
  measurementId: "G-SKG8GWB5H9"
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
