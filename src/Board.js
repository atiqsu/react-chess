import React from "react";
import Square from './Square';


export default class Board extends React.Component {

    constructor(props) {
        super(props);


        this.state = {
            squares: Array(64).fill(null),
            xIsNext: true,
            selectedPiece: null,
            squareSelected:false,
            highlightColor:'',
            selectedSquare: -1,
            errorPos: -1,
            lastMovePos: -1,
            validMoves:[],
        };

        this.handleStartTrigger = this.handleStartTrigger.bind(this);
    }

    handleClick(i) {

        const blackPiece = ['bR','bN','bB','bQ','bK','bP'];
        const whitePiece = ['wR','wN','wB','wQ','wK','wP'];


        if(this.state.xIsNext) {
            //White player turn.......

            if(this.state.selectedSquare === -1) {
                //No piece is selected right now......

                if(this.state.squares[i]) {
                    //clicked in a piece....

                    if(whitePiece.indexOf(this.state.squares[i]) < 0) {
                        //clicked piece is not white....

                        this.setState({...this.state, errorPos:i, highlightColor: 'err'});

                    } else {
                        //clicked piece is white....

                        let vm = getValidMoves(i, this.state.squares[i], this.state.squares);

                        this.setState({
                            ...this.state,
                            selectedPiece: this.state.squares[i],
                            selectedSquare: i,
                            validMoves:vm,
                        });
                    }

                } else {


                }


            } else {
                //A white piece is selected by white player

                if(this.state.squares[i]) {
                    // clicked in occupied square....

                    if(this.state.selectedSquare === i) {

                        this.setState({
                            ...this.state,
                            selectedSquare: -1,
                            validMoves:[]
                        });
                    }


                } else {

                    //clicked in blank square..

                    if(isValid(i, this.state.validMoves)) {

                        const squares = this.state.squares.slice();

                        squares[i] = this.state.selectedPiece;
                        squares[this.state.selectedSquare] = null;

                        this.setState({
                            squares: squares,
                            xIsNext: !this.state.xIsNext,
                            selectedSquare: -1,
                            selectedPiece: null,
                            errorPos: -1,
                            lastMovePos: i,
                            highlightColor: '',
                            validMoves:[]
                        });

                    } else {

                        this.setState({
                            ...this.state,
                            errorPos: i,
                            highlightColor: 'err'
                        });
                    }
                }
            }

        } else {

            //black player......

            if(this.state.selectedSquare === -1) {
                //No black piece is selected

                if(this.state.squares[i]) {


                    if(blackPiece.indexOf(this.state.squares[i]) < 0) {

                        this.setState({...this.state, selectedSquare: -1, selectedPiece: null, errorPos:i, highlightColor: 'err'});

                    } else {

                        //console.log('wtf....', this.state.xIsNext, this.state.selectedSquare, this.state.squares[i]);

                        this.setState({...this.state, selectedSquare: i, selectedPiece: this.state.squares[i], errorPos:i, highlightColor: 'slt'});
                    }

                } else {


                }


            } else {
                // A black piece is selected

                if(this.state.squares[i]) {
                    // clicked on occupied square

                    if(this.state.selectedSquare === i) {
                        // clicked on same square... deselect it

                        this.setState({
                            ...this.state,
                            selectedSquare: -1
                        });
                    }


                } else {

                    const squares = this.state.squares.slice();

                    squares[i] = this.state.selectedPiece;
                    squares[this.state.selectedSquare] = null;

                    this.setState({
                        squares: squares,
                        xIsNext: !this.state.xIsNext,
                        selectedSquare: -1,
                        selectedPiece: null,
                        errorPos: -1,
                        highlightColor: ''
                    });
                }
            }
        }
    }

    handleStartTrigger() {

        //const squares = this.state.squares.slice();
        const squares = Array(64).fill(null);

        squares[0] = 'wR';
        squares[1] = 'wN';
        squares[2] = 'wB';
        squares[3] = 'wQ';
        squares[4] = 'wK';
        squares[5] = 'wB';
        squares[6] = 'wN';
        squares[7] = 'wR';
        squares[8] = 'wP';
        squares[9] = 'wP';
        squares[10] = 'wP';
        squares[11] = 'wP';
        squares[12] = 'wP';
        squares[13] = 'wP';
        squares[14] = 'wP';
        squares[15] = 'wP';

        squares[48] = 'bP';
        squares[49] = 'bP';
        squares[50] = 'bP';
        squares[51] = 'bP';
        squares[52] = 'bP';
        squares[53] = 'bP';
        squares[54] = 'bP';
        squares[55] = 'bP';
        squares[56] = 'bR';
        squares[57] = 'bN';
        squares[58] = 'bB';
        squares[59] = 'bQ';
        squares[60] = 'bK';
        squares[61] = 'bB';
        squares[62] = 'bN';
        squares[63] = 'bR';

        this.setState({
            squares: squares,
            xIsNext: true,
            selectedSquare: -1,
            selectedPiece: null,
            errorPos: -1,
            highlightColor: '',
            validMoves:[],
            lastMovePos: -1,
            squareSelected:false,
        });
    }

    renderSquare(i, color) {

        let squareColor = color ? color : 'white';

        return <Square
            key={i}
            pos={i}
            piece={this.state.squares[i]}
            color={squareColor}

            isSelected={this.state.selectedSquare === i}
            isError={this.state.errorPos === i}
            isLastMove={this.state.lastMovePos === i}
            isHighlighted={isValid(i, this.state.validMoves)}

            onClick={()=> this.handleClick(i)}

        />;
    }

    render() {

        const status = 'Current move: ' + (this.state.xIsNext ? 'White' : 'Black');

        const items = [];
        let clr = 'black';

        for(var k = 0; k < 64; k++) {

            if(k%8 !== 0) {

                clr = clr === 'black' ? 'white' : 'black';
            }

            items.push(this.renderSquare(k, clr));
        }

        return (
            <div>
                <div className="status">{status}</div>
                <div className="board">
                    {items}
                </div>

                <button className='btn btn-primary' onClick={this.handleStartTrigger}> Start Game...</button>
            </div>
        );
    }
}



function getValidMoves(currentPos, piece, squares) {

    const blackPiece = ['bR','bN','bB','bQ','bK','bP'];
    const whitePiece = ['wR','wN','wB','wQ','wK','wP'];

    let tmp1, tmp2, tmp3, tmp4;
    let ret = [];

    switch(piece) {

        case 'wP':
            if(currentPos >= 8 && currentPos <= 15) {

                tmp1 = currentPos + 8;
                tmp2 = currentPos + 16;

                if(!squares[tmp1]) ret.push(tmp1);
                if(squares[tmp1] && blackPiece.indexOf(squares[tmp1]) >= 0 ) ret.push(tmp1);

                if(!squares[tmp2] && !squares[tmp1]) ret.push(tmp2);

                tmp1 = currentPos + 7;
                tmp2 = currentPos + 9;

                if(tmp1 >= 16 && squares[tmp1] && blackPiece.indexOf(squares[tmp1]) >= 0 ) ret.push(tmp1);
                if(tmp2 <= 23 && squares[tmp2] && blackPiece.indexOf(squares[tmp2]) >= 0 ) ret.push(tmp2);

            } else {

                tmp1 = currentPos + 8;
                tmp2 = currentPos + 7;
                tmp3 = currentPos + 9;
                tmp4 = currentPos % 8;

                if(!squares[tmp1]) ret.push(tmp1);
                if(squares[tmp1] && blackPiece.indexOf(squares[tmp1]) >= 0 ) ret.push(tmp1);

                if(tmp4 === 0) {

                    if(squares[tmp3] && blackPiece.indexOf(squares[tmp3]) >= 0 ) ret.push(tmp3);

                } else if(tmp4 === 7) {

                    if(squares[tmp2] && blackPiece.indexOf(squares[tmp2]) >= 0 ) ret.push(tmp2);

                } else {

                    if(squares[tmp2] && blackPiece.indexOf(squares[tmp2]) >= 0 ) ret.push(tmp2);
                    if(squares[tmp3] && blackPiece.indexOf(squares[tmp3]) >= 0 ) ret.push(tmp3);
                }
            }

            return ret;

        case 'bP':


    }
}


function isValid(pos, validMovesArr) {

    return validMovesArr.length > 0 && validMovesArr.indexOf(pos) >= 0;
}