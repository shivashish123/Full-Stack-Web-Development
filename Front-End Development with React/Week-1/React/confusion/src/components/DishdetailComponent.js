import React, { Component } from 'react';
import { Card, CardImg, CardImgOverlay, CardText, CardBody, CardTitle } from 'reactstrap';

class DishDetail extends Component {

    constructor(props){
        super(props);
    }

    renderDish(dish){
        if(dish != null) {
            return(
                    <Card>
                        <CardImg src={dish.image} alt={dish.name} />
                        <CardBody>
                            <CardTitle><h4>{dish.name}</h4></CardTitle>
                            <CardText>{dish.description}</CardText>
                        </CardBody>
                    </Card>
                
            );
        }
        else{
            return (
                <div></div>
            );
        }
    }

    renderComments(dish){
        var comments = null;
        if(dish != null)
            comments = dish.comments;
        if (comments != null) {

            let list = comments.map((comments)=>{

                return(
                    <li key={comments.id} >
                        <div>
                            <p>{comments.comment}</p>
                            <p>--{comments.author} , {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comments.date)))} </p>
                        </div>
                    </li>

                );
            })

            return(
                <Card>
                    <CardBody>
                            <CardTitle><h4>Comments</h4></CardTitle>
                            <CardText>
                                <ul className="list-unstyled">
                                    {list}
                                </ul>
                            </CardText>
                    </CardBody>
                </Card>        
            );
        }
        else{
            return(
                <div></div>
            );
        }
    }

    render() {
        const dish = this.props.selectedDish;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-5 m-1">
                        {this.renderDish(dish)}
                    </div>
                    <div className="col-12 col-md-5 m-1">
                        {this.renderComments(dish)}
                    </div>
                </div>
            </div>
        );
    }

}

export default DishDetail;