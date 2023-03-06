import React from "react";
import {Link, Route,BrowserRouter as Router, Routes} from "react-router-dom";
import "../styles/Navbar.css"
import "../styles/Homediv.css"
import Home from "./Home.jsx";
import Movies from "./Movies.jsx";
import Reservation from "./Reservation.jsx";

function Navbar(){


    function About(){
        return <h2>About</h2>
    }

    function Contact(){
        return <h2>Contact</h2>
    }

    return (
        <Router>
            <div id={"Navbar"}>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/about">About</Link>
                        </li>
                        <li>
                            <Link to="/contact">Contact</Link>
                        </li>
                        <li>
                            <Link to="/Movies">Movies</Link>
                        </li>
                    </ul>
                </nav>
            </div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path = "/Movies" element={<Movies/>}/>
                <Route path ="/Reservation" element = {<Reservation/>}/>
            </Routes>
        </Router>
    )
}

export default Navbar