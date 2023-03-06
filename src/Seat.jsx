import React from "react";


class Seat{
    constructor(isReserved, context, size, xCoord, yCoord) {
        this.isReserved = isReserved;
        this.context = context;
        this.size = size;
        this.xCoord = xCoord;
        this.yCoord = yCoord;
    }

    drawSeat(){
        if(this.isReserved){
            this.context.strokeStyle = "red";
        }else{
            this.context.strokeStyle = "green";
        }
        this.context.beginPath();
        this.context.lineWidth = "1";
        this.context.rect(this.xCoord*this.size, this.yCoord*this.size, this.size, this.size);
        this.context.stroke();
    }
}

export default Seat;