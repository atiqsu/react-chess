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
            blackDownPiece:[],
            whiteDownPiece:[],
            kingIsInCheck: false,
            blackPossession:[],
            whitePossession:[],
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

                        playInvalidMove();

                        this.setState({
                            ...this.state,
                            errorPos:i,
                            highlightColor: 'err'
                        });

                    } else {
                        //clicked piece is white....

                        let inCheck = {black:false, white:false};

                        let vm = getValidMoves(i, this.state.squares[i], this.state.squares, inCheck);

                        this.setState({
                            ...this.state,
                            selectedPiece: this.state.squares[i],
                            selectedSquare: i,
                            validMoves:vm,
                        });
                    }

                } else {

                    // this is white turn and clicked on an empty square.... do nothing...
                    //do a invalid sound..
                }


            } else {
                //A white piece is selected by white player

                if(this.state.squares[i]) {
                    // clicked in occupied square....

                    if(this.state.selectedSquare === i) {
                        // clicked the same selected square

                        this.setState({
                            ...this.state,
                            selectedSquare: -1,
                            errorPos: -1,
                            validMoves:[]
                        });

                    } else {

                        if(isValid(i, this.state.validMoves)) {

                            const squares = this.state.squares.slice();
                            const downPiece = this.state.blackDownPiece.slice();

                            downPiece.push(this.state.squares[i]);

                            squares[i] = this.state.selectedPiece;
                            squares[this.state.selectedSquare] = null;

                            if(this.state.selectedPiece === 'wP' && i>=56 && i<=63) {

                                squares[i] = 'wQ'; //todo - give user options to choose
                            }

                            //.............................

                            playCapture();

                            let inCheck = checkIfKingIsChecked(i, squares[i], squares);
                            let str = inCheck.black === true ? 'black' : (inCheck.white === true ? 'white' : false);

                            this.setState({
                                ...this.state,
                                squares: squares,
                                xIsNext: !this.state.xIsNext,
                                selectedSquare: -1,
                                selectedPiece: null,
                                errorPos: -1,
                                lastMovePos: i,
                                highlightColor: '',
                                validMoves:[],
                                blackDownPiece:downPiece,
                                kingIsInCheck: str,
                            });


                        } else {
                            // clicked on a occupied invalid square...

                            this.setState({
                                ...this.state,
                                errorPos: i,
                                highlightColor: 'err'
                            });

                            playInvalidMove();
                        }
                    }

                } else {

                    //clicked in blank square..

                    if(isValid(i, this.state.validMoves)) {

                        const squares = this.state.squares.slice();

                        squares[i] = this.state.selectedPiece;
                        squares[this.state.selectedSquare] = null;

                        let inCheck = checkIfKingIsChecked(i, squares[i], squares);
                        let str = inCheck.black === true ? 'black' : (inCheck.white === true ? 'white' : false);

                        this.setState({
                            squares: squares,
                            xIsNext: !this.state.xIsNext,
                            selectedSquare: -1,
                            selectedPiece: null,
                            errorPos: -1,
                            lastMovePos: i,
                            highlightColor: '',
                            validMoves:[],
                            kingIsInCheck: str,
                        });

                        playMove();

                    } else {

                        this.setState({
                            ...this.state,
                            errorPos: i,
                            highlightColor: 'err'
                        });

                        playInvalidMove();
                    }
                }
            }

        } else {

            //black player turn......

            if(this.state.selectedSquare === -1) {
                //No black piece is selected

                if(this.state.squares[i]) {
                    // clicked on occupied square

                    if(blackPiece.indexOf(this.state.squares[i]) < 0) {
                        // clicked piece is not black

                        playInvalidMove();

                        this.setState({
                            ...this.state,
                            errorPos:i,
                            validMoves:[],
                        });

                    } else {

                        //clicked piece is black....

                        let vm = getValidMoves(i, this.state.squares[i], this.state.squares);

                        this.setState({
                            ...this.state,
                            selectedPiece: this.state.squares[i],
                            selectedSquare: i,
                            errorPos:-1,
                            validMoves:vm,
                        });
                    }

                } else {

                    //this black turn and clicked on a blank square ... we are allowing it..
                    // do nothing...........................................................
                }

            } else {
                // A black piece is selected by black player

                if(this.state.squares[i]) {
                    // clicked on occupied square

                    if(this.state.selectedSquare === i) {
                        // clicked on same square... deselect it

                        this.setState({
                            ...this.state,
                            selectedSquare: -1,
                            errorPos: -1,
                            validMoves:[]
                        });

                    } else {

                        if(isValid(i, this.state.validMoves)) {

                            const squares = this.state.squares.slice();
                            const downPiece = this.state.whiteDownPiece.slice();

                            downPiece.push(this.state.squares[i]);

                            squares[i] = this.state.selectedPiece;
                            squares[this.state.selectedSquare] = null;

                            if(this.state.selectedPiece === 'bP' && i>=0 && i<=7) {

                                squares[i] = 'bQ'; //todo - give user options to choose
                            }

                            let inCheck = checkIfKingIsChecked(i, squares[i], squares);
                            let str = inCheck.black === true ? 'black' : (inCheck.white === true ? 'white' : false);

                            this.setState({
                                ...this.state,
                                squares: squares,
                                xIsNext: !this.state.xIsNext,
                                selectedSquare: -1,
                                selectedPiece: null,
                                errorPos: -1,
                                lastMovePos: i,
                                highlightColor: '',
                                validMoves:[],
                                whiteDownPiece:downPiece,
                                kingIsInCheck: str,
                            });

                            playCapture();

                        } else {

                            this.setState({
                                ...this.state,
                                errorPos: i,
                                highlightColor: 'err'
                            });

                            playInvalidMove();
                        }
                    }

                } else {
                    // clicked on blank square...

                    if(isValid(i, this.state.validMoves)) {

                        const squares = this.state.squares.slice();

                        squares[i] = this.state.selectedPiece;
                        squares[this.state.selectedSquare] = null;

                        let inCheck = checkIfKingIsChecked(i, squares[i], squares);
                        let str = inCheck.black === true ? 'black' : (inCheck.white === true ? 'white' : false);


                        this.setState({
                            squares: squares,
                            xIsNext: !this.state.xIsNext,
                            selectedSquare: -1,
                            selectedPiece: null,
                            errorPos: -1,
                            lastMovePos: i,
                            highlightColor: '',
                            validMoves:[],
                            kingIsInCheck: str,
                        });

                        playMove();

                    } else {

                        this.setState({
                            ...this.state,
                            errorPos: i,
                            highlightColor: 'err'
                        });

                        playInvalidMove();
                    }
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
            blackDownPiece:[],
            whiteDownPiece:[],
            kingIsInCheck: false,
            blackPossession:[40,41,42,43,44,45,46,47],
            whitePossession:[16,17,18,19,20,21,22,23],
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
        const isInCheck = this.state.kingIsInCheck === false ? '' : this.state.kingIsInCheck + ' king is in check';

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
                <div className={this.state.kingIsInCheck === false ? 'check_status ' : 'check_status in_check'}> {isInCheck} &nbsp; </div>
                <div className="board">
                    {items}
                </div>

                <button className='btn btn-primary' onClick={this.handleStartTrigger}> Start Game...</button>
            </div>
        );
    }
}

function checkIfKingIsChecked(currentPos, piece, squares) {

    let tmp1, tmp2, tmp3, tmp4, inCheckObj = {};

    inCheckObj.black = false;
    inCheckObj.white = false;

    switch(piece) {

        case 'wP':

            tmp1 = currentPos + 7;
            tmp2 = currentPos + 9;
            tmp3 = currentPos % 8;

            if(tmp3 === 0) {

                if(squares[tmp2] === 'bK') {

                    inCheckObj.black = true;
                }

            } else if(tmp3 === 7) {

                if(squares[tmp1] === 'bK') {

                    inCheckObj.black = true;
                }

            } else {

                if(squares[tmp1] === 'bK') {

                    inCheckObj.black = true;
                }

                if(squares[tmp2] === 'bK') {

                    inCheckObj.black = true;
                }
            }

            break;

        case 'bP':

            tmp1 = currentPos - 7;
            tmp2 = currentPos - 9;
            tmp3 = currentPos % 8;

            if(tmp3 === 0) {

                if(squares[tmp1] === 'wK') {

                    inCheckObj.white = true;
                }

            } else if(tmp3 === 7) {

                if(squares[tmp2] === 'wK') {

                    inCheckObj.white = true;
                }

            } else {

                if(squares[tmp1] === 'wK') {

                    inCheckObj.white = true;
                }

                if(squares[tmp2] === 'wK') {

                    inCheckObj.white = true;
                }
            }

            break;

        case 'wQ':
        case 'bQ':

        case 'wB':
        case 'bB':

        case 'wN':
        case 'bN':

        case 'wR':
        case 'bR':

    }

    return inCheckObj;
}

function getValidMoves(currentPos, piece, squares, inCheckObj) {

    const blackPiece = ['bR','bN','bB','bQ','bK','bP'];
    const whitePiece = ['wR','wN','wB','wQ','wK','wP'];

    let tmp1, tmp2, tmp3, tmp4, mod;
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

            if(currentPos >= 48 && currentPos <= 55) {

                tmp1 = currentPos - 8;
                tmp2 = currentPos - 16;

                if(!squares[tmp1]) ret.push(tmp1);
                if(squares[tmp1] && whitePiece.indexOf(squares[tmp1]) >= 0 ) ret.push(tmp1);

                if(!squares[tmp2] && !squares[tmp1]) ret.push(tmp2);

                tmp1 = currentPos - 7;
                tmp2 = currentPos - 9;

                if(tmp1 >= 40 && squares[tmp1] && whitePiece.indexOf(squares[tmp1]) >= 0 ) ret.push(tmp1);
                if(tmp2 <= 47 && squares[tmp2] && whitePiece.indexOf(squares[tmp2]) >= 0 ) ret.push(tmp2);

            } else {

                tmp1 = currentPos - 8;  //32-24
                tmp2 = currentPos - 7;  //32-25
                tmp3 = currentPos - 9;  //32-23
                tmp4 = currentPos % 8;  //32-0

                if(!squares[tmp1]) ret.push(tmp1);

                if(tmp4 === 0) {

                    if(squares[tmp2] && whitePiece.indexOf(squares[tmp2]) >= 0 ) ret.push(tmp2);

                } else if(tmp4 === 7) {

                    if(squares[tmp3] && whitePiece.indexOf(squares[tmp3]) >= 0 ) ret.push(tmp3);

                } else {

                    if(squares[tmp2] && whitePiece.indexOf(squares[tmp2]) >= 0 ) ret.push(tmp2);
                    if(squares[tmp3] && whitePiece.indexOf(squares[tmp3]) >= 0 ) ret.push(tmp3);
                }
            }

            return ret;

        case 'wK':

            mod = currentPos % 8;

            let arr = [];

            if(mod === 0) {

                arr.push(currentPos + 1);   //32-33
                arr.push(currentPos + 8);  // 32-40
                arr.push(currentPos + 9);  // 32-41
                arr.push(currentPos - 8);  // 32-24
                arr.push(currentPos - 7);  // 32-25

            } else if(mod === 7) {

                arr.push(currentPos + 7);  //39-46
                arr.push(currentPos + 8);  //39-47
                arr.push(currentPos - 1);  //39-38
                arr.push(currentPos - 8);  //39-31
                arr.push(currentPos - 9);  //39-30

            } else {

                arr.push(currentPos + 1);   //32-33
                arr.push(currentPos + 7);  //39-46
                arr.push(currentPos + 8);  // 32-40
                arr.push(currentPos + 9);  // 32-41
                arr.push(currentPos - 1);  //39-38
                arr.push(currentPos - 7);  // 32-25
                arr.push(currentPos - 8);  //39-31
                arr.push(currentPos - 9);  //39-30
            }

            tmp1 = currentPos + 8;
            tmp2 = currentPos + 7;
            tmp3 = currentPos + 9;


            break;
        case 'bK':

            break;


        case 'wN':
        case 'bN':
    }

    return ret;
}


function isValid(pos, validMovesArr) {

    return validMovesArr && validMovesArr.length > 0 && validMovesArr.indexOf(pos) >= 0;
}


function playMove() {

    let snd = new Audio("/audio/chess_move.mp3"); // buffers automatically when created
    snd.play();

    return true;
}


function playInvalidMove() {

    let snd = new Audio("/audio/error_move3.mp3"); // buffers automatically when created
    snd.play();

    return true;
}


function playCapture() {

    let snd = new Audio("/audio/chess_capture1.mp3"); // buffers automatically when created
    snd.play();

    return true;
}

