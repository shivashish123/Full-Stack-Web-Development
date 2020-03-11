import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Button, Alert, PanResponder } from 'react-native';
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

class RenderDish extends Component {

    constructor(props){
        super(props);
    }

    handleViewRef = ref => this.view =ref;

    render(){


        const dish = this.props.dish;

        const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
            if ( dx < -200 )
                return true;
            else
                return false;
        };

        const recognizeComment = ({ moveX, moveY, dx, dy }) => {
            if ( dx > 200 )
                return true;
            else
                return false;
        };
    
        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gestureState) => {
                return true;
            },
            onPanResponderGrant: () => {
                this.view.rubberBand(1000).then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));
            },
            onPanResponderEnd: (e, gestureState) => {
                console.log("pan responder end", gestureState);
                if (recognizeDrag(gestureState))
                    Alert.alert(
                        'Add Favorite',
                        'Are you sure you wish to add ' + dish.name + ' to favorite?',
                        [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {text: 'OK', onPress: () => {this.props.favorite ? console.log('Already favorite') : this.props.onPress()}},
                        ],
                        { cancelable: false }
                    );
                if (recognizeComment(gestureState))
                {
                    this.props.toggleCommentModal();
                }
                    
                return true;
            }
        });
        
            if (dish != null) {
                return(
                    <Animatable.View animation="fadeInDown" duration={2000} delay={1000} 
                        ref={this.handleViewRef}
                        {...panResponder.panHandlers}>
                        <Card featuredTitle={dish.name}
                            image={{uri: baseUrl + dish.image}}>
                            <Text style={{margin: 10}}>
                                {dish.description}
                            </Text>
                            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                <Icon
                                    raised
                                    reverse
                                    name={ this.props.favorite ? 'heart' : 'heart-o'}
                                    type='font-awesome'
                                    color='#f50'
                                    onPress={() => this.props.favorite ? console.log('Already favorite') : this.props.onPress()}
                                />
                                <Icon
                                    raised
                                    reverse
                                    name={ 'pencil' }
                                    color='#512DA8'
                                    type='font-awesome'
                                    onPress={() => this.props.onPressComment()}
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
                    toggleCommentModal={() => this.toggleCommentModal()}
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