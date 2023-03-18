import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";


function MovieDiv(props){
    const [screenings, setScreenings] = useState([])

    useEffect(()=>{
        fetch("http://51.75.69.121/api/Movies/GetScreeningsByID?id=" + props.movieID)
            .then((response) => response.json())
            .then((data) => {
                let screeningsList = []
                for (let i = 0; i < data.length; i++) {
                    let object = {
                        id:data[i]['screening']['id'],
                        screeningTime:data[i]['screening']['screeningTime']
                    }
                    screeningsList.push(object)
                }
                setScreenings(screeningsList)
            });
    }, [])



    return (
        <div id={"CenterDiv"}>
            <h3>{props.name}</h3>
            <p>{props.description}</p>
            <div id={"ScreeningsDiv"}>
                <img src={props.imageLink} height={"300"} alt={"NON REDUNDANT SHIT"}/>
                <div>{screenings.map((everyScreening)=>(
                    <Link to={`/Reservation/${everyScreening.id}`} id={everyScreening.id}>{everyScreening.screeningTime}</Link>
                ))}</div>
            </div>
        </div>
    )
}

export default MovieDiv