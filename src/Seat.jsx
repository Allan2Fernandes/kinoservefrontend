import React from "react";


class Seat{
    constructor(isReserved, context, size, xCoord, yCoord) {
        this.isReserved = isReserved;
        this.newlyReserved = false
        this.context = context;
        this.size = size;
        this.xCoord = xCoord;
        this.yCoord = yCoord;
    }

    drawSeat(){
        if(this.isReserved){
            this.context.fillStyle = "red";
        }else if(this.newlyReserved){
            this.context.fillStyle = "blue";
        }else{
            this.context.fillStyle = "green"
        }

        this.context.fillRect(this.xCoord*this.size+5, this.yCoord*this.size+5, this.size-10, this.size-10);
        // this.context.beginPath();
        // this.context.lineWidth = "1";
        // this.context.rect(this.xCoord*this.size, this.yCoord*this.size, this.size, this.size);
        // this.context.stroke();
    }
}

export default Seat;