import React from "react";
import { Link } from "react-router-dom"
import { Fade, Zoom } from "react-awesome-reveal";
import 'animate.css';

function Home(){
    return (
        
        <div id="container">
            
                <Fade delay={500} duration={4000}>
                    <Link to="/Movies" id="child">One stop shop for all your movie needs </Link>
                </Fade>
            
            
        </div>
        
        
        
            
    )
}

export default Home