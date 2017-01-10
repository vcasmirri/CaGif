import React, { Component } from 'react';
import { View, Text, NativeAppEventEmitter, NativeModules } from 'react-native';
import Health from '../services/health';

import { Button, Card, CardSection } from './common';

class FitnessData extends Component {

  constructor(props) {
    super(props);

    // FitnessData.printData("Birthday Party", "4 Hello_World Drive, Palo Alto");
    // FitnessData.testCallback("Yes, you can.", (error, result) => {
    //   if(error){
    //     console.log('testCallback error', error);
    //   } else {
    //     console.log('testCallback result', result);
    //   }
    // });

    this.state = {
      steps: [],
      pressCount: 0
    };
    this.renderStepsData = this.renderStepsData.bind(this);
    this.updateStepsCount = this.updateStepsCount.bind(this);
  }

  componentWillMount() {
    console.log('componentWillMount');
    this.updateStepsCount();
    this.subscription = NativeAppEventEmitter.addListener(
      'StepStats',
      (body) => {
        console.log('StepStats handler',body);
        this.setState({steps: [body], pressCount: this.state.pressCount + 1});
      }
    );
  }

  componentWillUnmount(){
    this.subscription.remove();
  }

  renderStepsData() {
    console.log('rendering data', this.state.steps);
    return this.state.steps.map((day,i) => {
      return (
        <CardSection key={i}>
          <Text style={{fontSize: 16,alignSelf: 'center'}}>{Math.round(day.value)}</Text>
        </CardSection>
      );
    });
  }

  updateStepsCount() {
    console.log("setting steps");
    Health()
    .then((steps) => {
      this.setState({
        steps,
        pressCount: this.state.pressCount + 1
      })
    })
    .catch((error) => {
      this.setState({
        steps : [error],
        pressCount: this.state.pressCount + 10
      })
    })
  }
  render() {
    return (
      <View>
        <Text style={{textAlign:'center',fontSize: 18, marginTop: 40}}>FitnessData</Text>
        <Text style={{textAlign:'center', fontSize: 12}}>{this.state.pressCount}</Text>
        <Card>
          {this.renderStepsData()}
        </Card>
      </View>
    );
  }
}

export default FitnessData;