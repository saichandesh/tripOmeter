import React, { Component } from 'react';
import { View, 
         Text,
         StatusBar,
         Image,
         StyleSheet,
         Alert,
         PermissionsAndroid,
         Platform } from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import moment from "moment";
import { Button } from 'react-native-elements';
import { connect} from 'react-redux';

import avatar from '../../assests/avatar.png';
import startEndTrip from '../EndTrip/endTripTab';
import {newTrip, dismissModal} from '../../store/actions/index';

class HomeScreen extends Component{

    static navigatorStyle = {
        statusBarTextColorScheme: 'dark',
        statusBarColor: '#04724b',
        navBarBackgroundColor : '#33be89',
        navBarTitleTextCentered: true,
        navBarTextColor : 'white',
        navBarNoBorder: true,
        navBarButtonColor: 'white'
    }

    state = {
        time: moment().format("LTS"),
        date: moment().format("LL"),
        buttonStyle : styles.buttonStartTrip,
        buttonTitle : 'START TRIP',
        trip : null,
        tripTime : null,
        latitude: null,
        longitude: null,
        error: null,
        modalStyle: styles.dismissModal
    };

    constructor(props){
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
        this.props.newTrip();
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.endTripComplete){
            this.onEndTrip();
        }
        if(nextProps.dismissModal){
            this.onModalDismiss();
        }
    }

    // componentDidMount() {
    //     setInterval(() => {
    //         this.setState({
    //           time: moment().format("LTS"),
    //           date: moment().format("LL")
    //         })
    //       }, 1000);
    // }

    onModalDismiss = () => {
        this.setState({
            modalStyle : styles.dismissModal
        });
    }

    onNavigatorEvent = event => {
        if(event.type === 'NavBarButtonPress'){
            if(event.id === 'toggleMenu'){
                this.props.navigator.toggleDrawer({
                    side: 'left'
                });
            }
        }
    }

    onEndTrip = () => {
        this.setState({
            buttonStyle : styles.buttonStartTrip,
            buttonTitle : 'START TRIP',
            trip : null,
            tripTime: null,
            modalStyle : styles.dismissModal
        });
    }

    onEndTripOkay = () => {
        this.props.onDismissModal(false);
        startEndTrip();
        this.setState({
            modalStyle : styles.modal
        });
    }

    onStratTrip = () => {
        this.props.onDismissModal(false);
        this.setState({
            buttonStyle : styles.buttonEndTrip,
            buttonTitle : 'END TRIP',
            trip : `Trip Start Locaion - New York`,
            tripTime : `Trip Start Time\n${this.state.date} - ${this.state.time}`,
            error: null
        });
    }

    onPressHandler = () => {
        if(this.state.buttonTitle === 'END TRIP'){
            Alert.alert(
                'Trip Confirmation',
                'Do you want to end the trip ?',
                [
                {text: 'Cancel', style: 'cancel'},
                {text: 'OK', onPress: this.onEndTripOkay},
                ],
                { cancelable: false }
            )
        }else{
            this.onStratTrip();
        }
    }

    render(){
        return(
            <View style = {this.state.modalStyle}>
                <StatusBar backgroundColor="#04724b" 
                           barStyle="dark-content"/>
                <View style={styles.imageContainer}>
                    <Image source={avatar} style={styles.image}/>
                    <Text style={styles.inputText}>Driver Name : Hari Haran</Text>
                    <Text style={styles.inputText}>Cab Number : 20894</Text> 
                </View>
                <View style={styles.container}>
                    <Text style={styles.dateText}>
                        {this.state.date}
                    </Text>
                    <Text style={styles.timeText}>
                        {this.state.time}
                    </Text>
                    <KeepAwake />
              </View>
              <Text style={styles.tripInfo}>
                  {this.state.trip}
              </Text>
              <Text style={styles.tripInfo}>
                  {this.state.tripTime}
              </Text>
              <Button onPress={this.onPressHandler}
                      buttonStyle={this.state.buttonStyle}
                      textStyle={{textAlign: 'center'}}
                      title={this.state.buttonTitle}
              />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    imageContainer: {
        alignItems : 'center',
        backgroundColor : '#33be89',
        paddingBottom : 15
    },
    image : {
        width : 80,
        height : 80,
        marginTop : 20,
    },
    inputText:{
        color: 'white',
        fontSize : 15,
        marginTop : 10,
        fontWeight : 'bold'
    },
    container : {
        backgroundColor : 'black',
        margin : '10%',
        justifyContent : 'center',
        alignItems : 'center',
        padding : '5%',
        borderRadius : 50
    },
    timeText: {
        color: 'white',
        fontSize: 18,
    },
    dateText: {
        color: 'white',
        fontSize: 20,
    },
    buttonStartTrip : {
        backgroundColor: '#04724b', 
        borderRadius: 10, 
        marginTop : '10%',
    },
    buttonEndTrip : {
        backgroundColor: '#C6252F', 
        borderRadius: 10, 
        marginTop : '10%'
    },
    tripInfo: {
        textAlign : 'center',
        color: 'black',
        padding: '1%',
        fontWeight: 'bold',
        fontSize: 17
    },
    modal: {
        opacity : 0.4, 
        backgroundColor : 'grey', 
        flex: 1
    },
    dismissModal: {

    }
});

const mapDispatchToProps = dispatch => {
    return{
        newTrip : () => dispatch(newTrip()),
        onDismissModal : (dismissModalValue) => dispatch(dismissModal(dismissModalValue))
    }
}

const maptStateToProps = state => {
    return{
        endTripComplete : state.trip.endTripComplete,
        dismissModal: state.trip.dismissModal
    }
}

export default connect(maptStateToProps, mapDispatchToProps)(HomeScreen);
