import React from "react";


class Square extends React.Component {

    render() {
        return (
            <button
                className={'square ' + this.props.color }
                onClick={() => this.props.onClick()}

            >
                {this.props.piece}
            </button>
        );
    }
}


export default Square;