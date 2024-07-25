
import { BrowserRouter, Routes, Route, NavLink} from 'react-router-dom'
import React from 'react';

// Pages
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import HomePage from "./pages/HomePage"

function App() {
  return (

  <BrowserRouter>
    <header>
      <nav>
        <h1> Task 2</h1>
        <NavLink to="signup">SignUP</NavLink>
        <NavLink to="signin">Login</NavLink>
      </nav>
    </header>
    <main>
      <Routes>
        <Route path="" element={<SignUp />}/>
        <Route path="/signup" element={<SignUp />}/>
        <Route path="/signin" element={<SignIn />}/>
        <Route path="home" element={<HomePage/>} />
      </Routes>
    </main>
  </BrowserRouter>
    
  );
}

export default App;
