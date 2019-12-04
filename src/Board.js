import React from "react";
import Square from './Square';


export default class Board extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            squares: Array(64).fill({piece:null}),
            xIsNext: true,
        };
    }

    handleClick(i) {

        const squares = this.state.squares.slice();


        //squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            //squares: squares,
            xIsNext: !this.state.xIsNext
        });
    }


    renderSquare(i, color) {
        return <Square value={i} color={color ? color : 'white'} />;
    }

    render() {

        const status = 'Next player: X';

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
            </div>
        );
    }
}
