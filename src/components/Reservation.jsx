import Seat from "../Seat.jsx";
import React from "react";

class Reservation extends React.Component{
    canvasStyle = {
        position: "absolute",
        top:"0",
        bottom: "0",
        left: "0",
        right: "0",
        margin:"auto",
        backgroundColor:"#ebf2ed",
    }

    constructor() {
        super();
        //Create the canvas
        this.canvasRef = React.createRef();


        let pathName = window.location.pathname.split()
        this.id = pathName[0].substring(13)
        this.seatsList = []
        this.alreadyReservedSeats = []
        //Declare dimensions
        this.seatSize = 40

        this.numColumns = 20
        this.canvasDimensionWidth = this.seatSize*this.numColumns

        this.numRows = 20
        this.canvasDimensionHeight = this.seatSize*this.numRows
        this.validEmail = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');
        this.inputtedEmail = "";
        this.validEmailEntered = false;
        this.userJSONDetails = null;

    }

    createSeats = ()=>{
        (async ()=>{
            // let canvas = document.getElementById("cinemaCanvas");
            // let context = canvas.getContext("2d");
            this.context.clearRect(0,0, this.canvas.width, this.canvas.height)

            this.seatsList = new Array(this.numColumns)

            //Get previously reserved seats
            this.alreadyReservedSeats = await this.getPreviouslyReservedSeats()
            //Initialize rows
            for (let i = 0; i < this.numColumns; i++) {
                this.seatsList[i] = new Array(this.numRows)
                for (let j = 0; j < this.numRows; j++) {
                    let hasBeenReserved = false
                    if(this.alreadyReservedSeats.find((object) => object.row===j && object.column ===i)){
                        hasBeenReserved = true
                    }
                    // Get the previously reserved status here and then set the boolean value in the constructor
                    this.seatsList[i][j] = new Seat(hasBeenReserved, this.context, this.seatSize, i, j)
                }
            }
            this.drawAllSeats()

        })();
    }

    drawAllSeats=()=>{
        //drawBorder()
        for (let i = 0; i < this.numColumns; i++) {
            for (let j = 0; j < this.numRows; j++) {
                this.seatsList[i][j].drawSeat()
            }
        }
    }

    getPreviouslyReservedSeats= async ()=>{
        let seats = []
        await fetch("http://51.75.69.121/api/Reservation/GetSeatsByScreeningID?sID=" + this.id).then((response)=> response.json())
            .then((response)=>{
                for (let i = 0; i < response.length; i++) {
                    seats.push(response[i])
                }

            })
        return seats
    }



    componentDidMount() {
        (async ()=>{
            this.canvas = this.canvasRef.current;
            this.context = this.canvas.getContext('2d')
            await fetch("http://51.75.69.121/api/Reservation/GetTheaterByScreeningID?sID=" + this.id).then((response)=> response.json())
                .then((response)=>{
                    this.numRows =  response['rows']
                    this.numColumns = response['columns']
                    this.canvasDimensionWidth = this.seatSize*this.numColumns
                    this.canvasDimensionHeight = this.seatSize*this.numRows
                    this.canvas.width = this.canvasDimensionWidth
                    this.canvas.height = this.canvasDimensionHeight
                })

            //drawBorder();
            this.createSeats();
        })();
    }

    SeatSelectionEventHandler = (event)=>{
        let xPos = event.clientX - event.target.offsetLeft
        let yPos = event.clientY - event.target.offsetTop
        let xCoord = Math.floor(xPos/this.seatSize)
        let yCoord = Math.floor(yPos/this.seatSize)
        if(this.alreadyReservedSeats.find(object => object.row===yCoord && object.column ===xCoord)){
            console.log("Already reserved")
            return
        }
        this.seatsList[xCoord][yCoord].newlyReserved = !this.seatsList[xCoord][yCoord].newlyReserved
        this.drawAllSeats()
    }

    getAllSeatReservation=()=>{
        let newlyReservedSeats = []
        for (let i = 0; i < this.numColumns; i++) {
            for (let j = 0; j < this.numRows; j++) {
                if(this.seatsList[i][j].newlyReserved){
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

    confirmReservation=()=>{
        (async () =>{
            if(!this.validEmailEntered){
                console.log("Invalid email entered");
                return;
            }
            //Get list of newly reserved seats
            let reservedSeats = this.getAllSeatReservation()
            console.log("Number of newly reserved seats = " + reservedSeats.length)
            let reservationDetails = {
                "screeningID": this.id,
                "customerEmail": this.inputtedEmail,
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
            console.log(JSON.stringify(reservationDetails))
            fetch('http://51.75.69.121/api/Reservation/MakeReservation', requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    this.createSeats();
                });
        })();
    }

    getUserDetailsOnEmail = async ()=>{
        await fetch("http://51.75.69.121/api/Customer/GetCustomer?email=" + this.inputtedEmail)
            .then((response) => {
                if(response.status === 200){
                    return response.json();
                }
            })
            .then((data) =>{
                this.userJSONDetails = data;
            })

    }

    onEmailInputFieldChange= async (event)=>{
        this.inputtedEmail = event.target.value
        if(this.validEmail.test(this.inputtedEmail)){
            this.validEmailEntered = true;
            //If a valid email has been entered, do a GET for user details
            await this.getUserDetailsOnEmail();
            await this.updateInputFields();

        }else{
            console.log("Invalid email")
            this.validEmailEntered = false;
        }

    }

    updateInputFields = ()=>{
        let firstNameInputField = document.getElementById('firstNameInput')
        let lastNameInputField = document.getElementById('lastNameInput')
        let phoneInputField = document.getElementById("phoneNumberInput")
        let streetInputField = document.getElementById("addressStreetInput")
        let cityInputField = document.getElementById("addressCityInput")
        let zipCodeInputField = document.getElementById("zipCodeInput")
        let countryInputField = document.getElementById("countryInput")
        let passwordInputField = document.getElementById("passwordInput")
        firstNameInputField.value = this.userJSONDetails['firstName'];
        lastNameInputField.value = this.userJSONDetails['lastName'];
        phoneInputField.value = this.userJSONDetails['phone'];
        streetInputField.value = this.userJSONDetails['address'];
        cityInputField.value = this.userJSONDetails['city'];
        zipCodeInputField.value = this.userJSONDetails['zipCode'];
        countryInputField.value = this.userJSONDetails['country']
        passwordInputField.value = this.userJSONDetails['password']
    }


    postDetailsClickHandler = ()=>{
        let firstNameInputField = document.getElementById('firstNameInput')
        let lastNameInputField = document.getElementById('lastNameInput')
        let phoneInputField = document.getElementById("phoneNumberInput")
        let streetInputField = document.getElementById("addressStreetInput")
        let cityInputField = document.getElementById("addressCityInput")
        let zipCodeInputField = document.getElementById("zipCodeInput")
        let countryInputField = document.getElementById("countryInput")
        let passwordInputField = document.getElementById("passwordInput")
        let updatedUserDetails = {
            "email": this.inputtedEmail,
            "firstName": firstNameInputField.value,
            "lastName": lastNameInputField.value,
            "phone": phoneInputField.value,
            "address": streetInputField.value,
            "city": cityInputField.value,
            "zipCode": zipCodeInputField.value,
            "country": countryInputField.value,
            "password": passwordInputField.value
        }
        const requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(updatedUserDetails)
        };
        console.log(JSON.stringify(updatedUserDetails))
        fetch('http://51.75.69.121/api/Customer/PostCustomer', requestOptions)
            .then((response) => {
                console.log(response)
            })
    }

    render() {
        return (
            <div>
                <canvas ref={this.canvasRef} style={this.canvasStyle} width={this.canvasDimensionWidth} height={this.canvasDimensionHeight} onMouseUp={this.SeatSelectionEventHandler}>
                </canvas>
                <div>
                    <label>Enter Email </label>
                    <input
                        type={"email"}
                        id={"inputId"}
                        onChange={this.onEmailInputFieldChange}
                    />
                    <div>
                        <br/>
                        <label>First name: </label>
                        <input type={"text"} id={"firstNameInput"}/>
                        <br/>
                        <label>Last name: </label>
                        <input type={"text"} id={"lastNameInput"}/>
                        <br/>
                        <label>Phone Number: </label>
                        <input type={"text"} id={"phoneNumberInput"}/>
                        <br/>
                        <label>Address street: </label>
                        <input type={"text"} id={"addressStreetInput"}/>
                        <br/>
                        <label>Address city: </label>
                        <input type={"text"} id={"addressCityInput"}/>
                        <br/>
                        <label>City zip code: </label>
                        <input type={"number"} id={"zipCodeInput"}/>
                        <br/>
                        <label>Country: </label>
                        <input type={"text"} id={"countryInput"}/>
                        <br/>
                        <label>Password: </label>
                        <input type={"password"} id={"passwordInput"}/>
                        <br/>
                        <button onClick={this.postDetailsClickHandler}>Update user</button>
                    </div>
                </div>
                <button onClick={this.confirmReservation}>Confirm reservations</button>

            </div>
        );
    }
}

export default Reservation