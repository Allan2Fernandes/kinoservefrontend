import React, {useEffect, useState} from "react";
import {json, useLocation} from "react-router-dom";
import Seat from "../Seat.jsx";

function Reservation(){
    const [inputtedEmailText, setInputtedEmailText] = useState('');
    let iD = null;
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const data = searchParams.get("data");
    let seatsList = []
    let alreadyReservedSeats = []
    const validEmail = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');

    iD = data

    let canvasStyle = {
        position: "absolute",
        top:"0",
        bottom: "0",
        left: "0",
        right: "0",
        margin:"auto",
        backgroundColor:"#ebf2ed",
    }

    //Declare dimensions
    let seatSize = 40

    let numColumns = 20
    let canvasDimensionWidth = seatSize*numColumns
    let numRows = 20
    let canvasDimensionHeight = seatSize*numRows

    function CreateSeats(){
        (async ()=>{
            let canvas = document.getElementById("cinemaCanvas");
            let context = canvas.getContext("2d");
            context.clearRect(0,0, canvas.width, canvas.height)

            seatsList = new Array(numColumns)

            //Get previously reserved seats
            alreadyReservedSeats = await getPreviouslyReservedSeats()
            //Initialize rows
            for (let i = 0; i < numColumns; i++) {
                seatsList[i] = new Array(numRows)
                for (let j = 0; j < numRows; j++) {
                    let hasBeenReserved = false
                    if(alreadyReservedSeats.find(object => object.row===j && object.column ===i)){
                        hasBeenReserved = true
                    }
                    // Get the previously reserved status here and then set the boolean value in the constructor
                    seatsList[i][j] = new Seat(hasBeenReserved, context, seatSize, i, j)
                }
            }
            drawAllSeats()
        })();
    }

    function drawAllSeats(){
        drawBorder()
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
    }

    async function getPreviouslyReservedSeats(){
        let seats = []
        await fetch("http://51.75.69.121/api/Reservation/GetSeatsByScreeningID?sID=" + iD).then((response)=> response.json())
            .then((response)=>{
                for (let i = 0; i < response.length; i++) {
                    seats.push(response[i])
                }

            })
        return seats
    }


    useEffect(()=>{
        (async ()=>{
            await fetch("http://51.75.69.121/api/Reservation/GetTheaterByScreeningID?sID=" + iD).then((response)=> response.json())
                .then((response)=>{
                    numRows =  response['rows']
                    numColumns = response['columns']
                    canvasDimensionWidth = seatSize*numColumns
                    canvasDimensionHeight = seatSize*numRows
                    let canvas = document.getElementById("cinemaCanvas");
                    canvas.width = canvasDimensionWidth
                    canvas.height = canvasDimensionHeight
                })

            //drawBorder();
            CreateSeats();
        })();
    }, [])

    function SeatSelectionEventHandler(event){
        let xPos = event.clientX - event.target.offsetLeft
        let yPos = event.clientY - event.target.offsetTop
        let xCoord = Math.floor(xPos/seatSize)
        let yCoord = Math.floor(yPos/seatSize)
        if(alreadyReservedSeats.find(object => object.row===yCoord && object.column ===xCoord)){
            console.log("Already reserved")
            return
        }
        seatsList[xCoord][yCoord].newlyReserved = !seatsList[xCoord][yCoord].newlyReserved
        drawAllSeats()
    }

    function getAllSeatReservation(){
        let newlyReservedSeats = []
        for (let i = 0; i < numColumns; i++) {
            for (let j = 0; j < numRows; j++) {
                if(seatsList[i][j].newlyReserved){
                    let reservation = {
                        "row": j,
                        "column": i
                    }
                    newlyReservedSeats.push(reservation);
                }
            }
        }
        return newlyReservedSeats
    }



    function confirmReservation(){
        (async () =>{
            //Get list of newly reserved seats
            let reservedSeats = getAllSeatReservation()
            console.log("Number of newly reserved seats = " + reservedSeats.length)
            let reservationDetails = {
                "screeningID": iD,
                "customerID": inputtedEmailText,
                "seats": reservedSeats
            }
            const requestOptions = {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(reservationDetails)
            };
            fetch('http://51.75.69.121/api/Reservation/MakeReservation', requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    CreateSeats();
                });
        })();
    }

    function onEmailInputFieldChange(event){
        let inputtedEmail = event.target.value
        setInputtedEmailText(inputtedEmail)
        if(validEmail.test(inputtedEmail)){
            console.log("Valid email")
        }else{
            console.log("Invalid email")
        }
    }

    return (
        <div>
            <canvas onMouseUp={SeatSelectionEventHandler} style={canvasStyle} id={"cinemaCanvas"} width={canvasDimensionWidth} height={canvasDimensionHeight}>
            </canvas>
            <div>
                <label>Enter Email </label>
                <input
                type={"email"}
                id={"inputId"}
                onChange={onEmailInputFieldChange}
                />
            </div>
            <button onClick={confirmReservation}>Confirm reservations</button>
        </div>
    )
}

export default Reservation