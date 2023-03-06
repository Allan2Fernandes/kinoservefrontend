import React, {useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import Seat from "../Seat.jsx";

function Reservation(){
    let iD = null;
    let canvasStyle = {
        position: "absolute",
        top:"0",
        bottom: "0",
        left: "0",
        right: "0",
        margin:"auto",
        backgroundColor:"#ebf2ed",
    }

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const data = searchParams.get("data");
    iD = data


    //Declare dimensions
    let seatSize = 40

    let numColumns = 10
    let canvasDimensionWidth = seatSize*numColumns
    let numRows = 15
    let canvasDimensionHeight = seatSize*numRows


    function drawAllSeats(){
        let canvas = document.getElementById("cinemaCanvas");
        let context = canvas.getContext("2d");


        let seatsList = new Array(numColumns)
        //Initialize rows
        for (let i = 0; i < numColumns; i++) {
            seatsList[i] = new Array(numRows)
            for (let j = 0; j < numRows; j++) {
                seatsList[i][j] = new Seat(false, context, seatSize, i, j)
            }

        }

        for (let i = 0; i < numColumns; i++) {
            for (let j = 0; j < numRows; j++) {
                seatsList[i][j].drawSeat()
            }
        }
    }

    function drawBorder(){
        let canvas = document.getElementById("cinemaCanvas");
        let context = canvas.getContext("2d");
        context.beginPath();
        context.lineWidth = "3";
        context.strokeStyle = "red";
        context.rect(0, 0, canvasDimensionWidth, canvasDimensionHeight);
        context.stroke();
        console.log("drawing seat");
    }

    useEffect(()=>{
        drawBorder();
        drawAllSeats();
    }, [])

    return (
        <div>
            <canvas style={canvasStyle} id={"cinemaCanvas"} width={canvasDimensionWidth} height={canvasDimensionHeight}>

            </canvas>
        </div>
    )
}

export default Reservation