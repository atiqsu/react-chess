import React from "react";


class Square extends React.Component {

    render() {

        let cls = this.props.color;

        if(this.props.isError) cls += ' err';
        else if(this.props.isHighlighted) cls += ' hgt';
        else if(this.props.isLastMove) cls += ' lst';
        else if(this.props.isSelected) cls += ' slt';

        return (
            <button
                className={'square ' + cls }
                onClick={() => this.props.onClick()}
            >
                {this.props.piece}
            </button>
        );
    }
}


export default Square;