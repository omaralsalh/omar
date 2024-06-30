import React, { Component } from 'react';

class CommentCard extends Component {
    state = {  } 
    render() { 
        return (
            <div className="card">
                <div className="card-body">
                    <div className='card-top'>
                        <h5 className="card-title">{this.props.name}</h5>
                        <p className='comment-date'>{this.props.date}</p>
                    </div>

                    <p className="card-text">{this.props.content}</p>

                    <div className='card-bottom'>
                        <button onClick={this.props.onIncrement} className="btn btn-primary">Upvote</button>
                        <p className='upvotes'>Upvotes: {this.props.upvotes}</p>
                    </div>
                    
                    
                </div>
            </div>
        );
    }
}
 
export default CommentCard;