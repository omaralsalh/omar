import React, { Component } from 'react';


class NewComment extends Component {
    state = {
        name: '"Name"', // App later should recognize automatically which user is active
        content: ''
    }


    handleChange = (event) => {
        // Change state.content as soon as text in textarea changes
        this.setState({
            content: event.target.value
        });
    }
    
    handleOnClick = (e) => {
        
        if (this.refs.textarea.value != ""){
            const name = this.state.name;
            const content = this.state.content;
            const date = new Date().toLocaleDateString();
            this.props.addComment(name, content, date, 0);
            // Delete text in textarea after sending comment
            this.refs.textarea.value = "";
            this.state.content = "";
        }
        
    }

    render() { 
        return (

            <div className="card">
                <div className="card-body">
                    <h5 className='new-comment-name'>Name</h5>

                    <textarea onChange={this.handleChange} ref="textarea" className="new-comment-input" type='text' placeholder='Add new Comment here'></textarea>

                    <button onClick={this.handleOnClick} className='new-comment-btn'>Send</button>
                    <img src="/assets/close_icon.png" style={{ width: '30px', height: '30px' }} onClick={this.props.cancel} className='cancel-comment-icon'/>
                    
                    
                </div>
            </div>



        );
    }
}
 
export default NewComment;