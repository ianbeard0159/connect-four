import React from 'react';

class Space extends React.Component{
    render(){
        return(
            <div className="space" style={this.props.color}></div>
        );
    }
}

function ControlPanel(props){
    return(
        <div className="controlPanel">
            <h3>Current Player: {props.cPlayer}</h3>
            <button onClick={props.onClick}>Reset</button>
        </div>
    );
}

class Board extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            boardState: [],
            players: ["black", "red"],
            currentPlayer: 0,
            winner: null,
        };
    }

    reset(){
        console.log("reset");
        this.setState({
            boardState: [],
            currentPlayer: 0,
            winner: null,
        })
    }
    
    calculateWinner(bState, inX, inY, cPlayer){
        var connection;
        var check;

        //                  -= Check Left and Right =-
        connection = 1;
        for(var i = 1; i < 4; i++){
            // Check Left
            check = false;
            if(typeof bState[inX + i] !== "undefined"){
                if(bState[inX + i][inY] === cPlayer){
                    check = true;
                    connection++;
                }
            }
            // Check Right
            if(typeof bState[inX - i] !== "undefined"){
                if(bState[inX - i][inY] === cPlayer){
                    check = true;
                    connection++;
                }
            }
            // If neither were true or of someoneone has connected four, break the loop
            if(!check){
                break;
            }
            else if(connection >= 4){
                console.log("Winner Horz");
                return cPlayer;
            }
        }
        
        //                  -= Check Up and Down =-
        connection = 1;
        for(var j = 1; j < 4; j++){
            // Check Up
            check = false;
            if(typeof bState[inX][inY - j] !== "undefined"){
                if(bState[inX][inY - j] === cPlayer){
                    check = true;
                    connection++;
                }
            }
            // Check Down
            if(typeof bState[inX][inY + j] !== "undefined"){
                if(bState[inX][inY + j] === cPlayer){
                    check = true;
                    connection++;
                }
            }
            
            // If neither were true or of someoneone has connected four, break the loop
            if(!check){
                break;
            }
            else if(connection >= 4){
                console.log("Winner Vert");
                return cPlayer;
            }
        }

        //                  -= Check Diagonal Down =-
        connection = 1;
        for(var k = 1; k < 4; k++){
            // Check Up
            check = false;
            if(typeof bState[inX - k] !== "undefined"){
                if(typeof bState[inX - k][inY - k] !== "undefined"){
                    if(bState[inX - k][inY - k] === cPlayer){
                        check = true;
                        connection++;
                    }
                }
            }
            // Check Down
            if(typeof bState[inX + k] !== "undefined"){
                    if(typeof bState[inX + k][inY + k] !== "undefined"){
                    if(bState[inX + k][inY + k] === cPlayer){
                        check = true;
                        connection++;
                    }
                }
            }
            
            // If neither were true or of someoneone has connected four, break the loop
            if(!check){
                break;
            }
            else if(connection >= 4){
                console.log("Winner D-Down");
                return cPlayer;
            }
        }

         //                  -= Check Diagonal Up =-
         connection = 1;
         for(var l = 1; l < 4; l++){
            // Check Up
            check = false;
            if(typeof bState[inX - l] !== "undefined"){
                if(typeof bState[inX - l][inY + l] !== "undefined"){
                    if(bState[inX - l][inY + l] === cPlayer){
                        check = true;
                        connection++;
                    }
                }
            }
            // Check Down
            if(typeof bState[inX + l] !== "undefined"){
                if(typeof bState[inX + l][inY - l] !== "undefined"){
                    if(bState[inX + l][inY - l] === cPlayer){
                        check = true;
                        connection++;
                    }
                }
            }
            
            // If neither were true or of someoneone has connected four, break the loop
            if(!check){
                break;
            }
            else if(connection >= 4){
                console.log("Winner D-Up");
                return cPlayer;
            }
        }
        return null;
    }

    columnClick(column, colHeight){
        var bState = this.state.boardState;
        var player = this.state.currentPlayer;
        var row;
        //If the column is not empty or full
        if(bState[column][colHeight-1] && !bState[column][0]){
            //Find out how full the column is
            for(var i = 0; i < colHeight; i++){
                if(bState[column][i]){
                    bState[column][i-1] = this.state.players[player];
                    row = i-1;
                    break;
                }
            }
        }
        //If the column is empty
        else if(!bState[column][colHeight-1]){
            bState[column][colHeight-1] = this.state.players[player];
            row = colHeight-1;
        }
        //If the column is full, don't change the board state
        else{
            console.log("completely full");
            return;
        }

        // See if there is a winner
        if(this.calculateWinner(bState, column, row, this.state.players[player])){
            console.log(this.state.players[player] + " is the winner");
            this.setState({
                boardState: bState,
                winner: this.state.players[player],
            });
        }

        //Move to next player
        player++;
        if(player === this.state.players.length){
            player = 0;
        }
        this.setState({
            boardState: bState,
            currentPlayer: player
        });
    }

    // Create Spaces
    renderSpace(column, row){
        return <Space color={{backgroundColor:  this.state.boardState[column][row]}}/>;
    }
    renderSpaces(){
        var spaceList = [];
        //For each column
        for(var column = 0; column < this.props.width; column++){
            // Populate boardState with a number of empty arrays equal to the width of the grid
            if(this.state.boardState.length < this.props.width){
                this.state.boardState.push([]);
            }
            var rowList = [];
            //For each row
            for(var row = 0; row < this.props.height; row++){
                rowList.push(this.renderSpace(column, row));
            }
            spaceList.push(<div className="col-container">
                <div className="column" id={column} onClick={(e) => this.columnClick(parseInt(e.target.id), parseInt(this.props.height))}></div>
                {rowList}
            </div>);
        }
        return spaceList;
    }

    render(){
        if(this.state.winner){
            return(
                <div className="container">
                    <div className="board">
                        <div className="win-display" >{this.state.winner} wins</div>
                        {this.renderSpaces()}
                    </div>
                    <ControlPanel cPlayer={this.state.players[this.state.currentPlayer]} onClick={() => this.reset()} />
                </div>
            );
        }
        else{
            return(
                <div className="container">
                    <div className="board">
                        <div className="win-display" style={{display: "none"}}></div>
                        {this.renderSpaces()}
                    </div>
                    <ControlPanel cPlayer={this.state.players[this.state.currentPlayer]} onClick={() => this.reset()} />
                </div>
            );
        }
    }
}

export default Board;