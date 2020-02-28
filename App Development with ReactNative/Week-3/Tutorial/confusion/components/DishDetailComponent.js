import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, Button } from 'react-native';
import { Rating, Card, Icon, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId,rating,author,comment) => dispatch(postComment(dishId,rating,author,comment))
})

function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Text>
                <Rating
                    readonly
                    startingValue={item.rating}
                    imageSize={15}
                    style={{justifyContent:'left'}}
                />
                </Text>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    
    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>        
            <Card title='Comments' >
                <FlatList 
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                    />
            </Card>
        </Animatable.View>
    );
}

function RenderDish(props) {

    const dish = props.dish;
    
        if (dish != null) {
            return(
                <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
                    <Card featuredTitle={dish.name}
                        image={{uri: baseUrl + dish.image}}>
                        <Text style={{margin: 10}}>
                            {dish.description}
                        </Text>
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <Icon
                                raised
                                reverse
                                name={ props.favorite ? 'heart' : 'heart-o'}
                                type='font-awesome'
                                color='#f50'
                                onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                            />
                            <Icon
                                raised
                                reverse
                                name={ 'pencil' }
                                color='#512DA8'
                                type='font-awesome'
                                onPress={() => props.onPressComment()}
                            />
                        </View>
                    </Card>
                 </Animatable.View>
            );
        }
        else {
            return(<View></View>);
        }
}

class DishDetail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            rating: 3,
            author: '',
            comment: '',
            showModal: false
        }
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    toggleCommentModal() {
        this.setState({showModal: !this.state.showModal});
    }

    resetCommentForm() {
        this.setState({
            rating: 3,
            author: '',
            comment: ''
        });
    }

    handleComment(dishId) {
        const { rating, author, comment } = this.state;
        this.props.postComment(dishId, rating, author, comment);
        this.resetCommentForm();
    }

    setRating(rat) {
        this.setState({ rating : rat });
    }

    setAuthor(auth) {
        this.setState({ author: auth});
    }

    setComment(com) {
        this.setState({ comment: com });
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)} 
                    onPressComment={() => {this.toggleCommentModal();this.resetCommentForm();}}
                    />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal 
                    animationType = {"slide"} 
                    transparent = {false}
                    visible = {this.state.showModal}
                    onDismiss = {() => this.toggleCommentModal() }
                    onRequestClose = {() => this.toggleCommentModal() }>
                    <View style={{margin: 20}}>
                        <Rating
                            showRating
                            onFinishRating={rating => this.setRating(rating)}
                        />
                    </View>
                    <View style={{margin: 20}}>
                        <Input
                            placeholder='Author'
                            leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                            onChangeText={author => this.setAuthor(author)}
                        />  
                    </View>
                    
                    <View style={{margin: 20}}>
                        <Input
                            placeholder='Comment'
                            leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                            onChangeText={comment => this.setComment(comment)}
                        />
                    </View>
                    
                    <View style={{margin: 20}}>
                        <Button
                            onPress={() => this.handleComment(dishId)}
                            color="#512DA8"
                            title="SUBMIT"
                        />
                    </View>
                    <View style={{margin: 20}}>
                        <Button
                            onPress={() => {this.toggleCommentModal();this.resetCommentForm();}}
                            color="#6c757d"
                            title="CANCEL"
                        />
                    </View>
                    
                </Modal>
            </ScrollView>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);