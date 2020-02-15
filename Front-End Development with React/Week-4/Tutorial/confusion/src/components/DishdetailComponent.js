import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody,Button, CardTitle, Breadcrumb, Modal, ModalHeader, ModalBody,
     BreadcrumbItem, Row, Col, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';

    function RenderDish({dish}){
        if(dish != null) {
            return(
                    <Card>
                        <CardImg top src={dish.image} alt={dish.name} />
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

    function RenderComments({comments, addComment, dishId}){
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
                    <CommentForm dishId={dishId} addComment={addComment}/>
                </Card> 
                     
            );
        }
        else{
            return(
                <div></div>
            );
        }
    }

    const DishDetail = (props) => {

        return (
            <div className="container">
            <div className="row">
                <Breadcrumb>
                    <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                    <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                </Breadcrumb>
                <div className="col-12">
                    <h3>{props.dish.name}</h3>
                    <hr />
                </div>                
            </div>
            <div className="row">
                <div className="col-12 col-md-5 m-1">
                    <RenderDish dish={props.dish} />
                </div>
                <div className="col-12 col-md-5 m-1">
                    <RenderComments comments={props.comments} 
                        addComment = {props.addComment}
                        dishId = {props.dish.id}
                        />
                </div>
            </div>
            </div>
        );
    }

    const required = (val) => val && val.length;
    const maxLength = (len) => (val) => !(val) || (val.length <= len);
    const minLength = (len) => (val) => val && (val.length >= len);

    class CommentForm extends Component{

        constructor(props) {
            super(props);
    
            this.state = {
                isModalOpen: false
            };
            this.toggleModal = this.toggleModal.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
        }
    
        toggleModal() {
            this.setState({
              isModalOpen: !this.state.isModalOpen
            });
        }
    
        handleSubmit(values) {
            this.toggleModal();
            this.props.addComment(this.props.dishId, values.rating, values.author, values.comment);
    
        }
    
        render() {
            return(
                <div>
                    <Button className="m-3" outline onClick={this.toggleModal}><span className="fa fa-pencil fa-lg "></span>  Submit Comment</Button>
    
                    <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                        <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                        <ModalBody>
                            <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                                <Row  className="form-group">
                                    <Label for="rating" md={12}>Rating</Label>
                                    <Col md={12}>
                                        <Control.select defaultValue="1" model=".rating" id="rating" name="rating" className="form-control" >
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </Control.select>
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Label htmlFor="author"  md={12}>Your Name</Label>
                                    <Col  md={12}>
                                        <Control.text model=".author" id="author" name="author" placeholder="Your Name" className="form-control" validators={{ required, minLength: minLength(3), maxLength: maxLength(15) }} />
                                        <Errors className="text-danger" model=".author" show="touched" messages=
                                        {{  required: 'Required', 
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 15 charaters or less'   
                                        }}
                                        />
                                    </Col>
                                </Row>
    
                                <Row className="form-group">
                                    <Label htmlFor="feedback"  md={12}>Comment</Label>
                                    <Col  md={12}>
                                        <Control.textarea model=".comment" id="comment" name="comment" resize="none" rows="6" className="form-control" />
                                    </Col>
                                </Row>
                                <Button type="submit" value="submit" color="primary">Submit</Button>
                            </LocalForm>
                        </ModalBody>
                    </Modal>
    
                </div>
            )
        }
    }

export default DishDetail;