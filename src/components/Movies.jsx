import React, {useEffect, useState} from "react";
import "../styles/MovieDiv.css"
import MovieDiv from "./MovieDiv.jsx";

function Movies(){
    const [allMovies, setAllMovies] = useState([]);
    useEffect(() => {
        fetch("http://51.75.69.121/api/Movies")
            .then((response) => response.json())
            .then((data) => {
                setAllMovies(data);
            });
    }, []);


    return (
        <div id={"MovieDiv"}>{
            allMovies.map((everyMovie)=>(
                <MovieDiv
                    key = {everyMovie.name}
                    name = {everyMovie.name}
                    description = {everyMovie.description}
                    imageLink = {everyMovie.imageLink}
                    movieID = {everyMovie.id}
                />
            ))
        }</div>
    )
}

export default Movies