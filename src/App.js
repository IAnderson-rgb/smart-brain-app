import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg'
import Clarifai from 'clarifai';
import './App.css'; 

const app = new Clarifai.App({
	apiKey: 'c30c2fb50a9a45d08978d7e69a4457a9'
 });

class App extends Component {
	constructor () {
		super();
		this.state = {
			input: '',
		} 
	} 

	onInputChange = (event) => {
		console.log(event.target.value);
	}

	onButtonSubmit = () => {
		console.log('click');
		app.models
      .predict(
        {
          id: 'face-detection',
          name: 'face-detection',
          version: '6dc7e46bc9124c5c8824be4822abe105',
          type: 'visual-detector',
        }, this.state.input)
	}

  render() {
		return (
			<div className='App'>
				{/* <ParticlesBg color="#E4EAEF" num={300} type="cobweb" bg={true} /> */}
				<ParticlesBg type='circle' bg={true} />
				<Navigation />
				<Logo />
				<Rank />
				<ImageLinkForm
					onInputChange={this.onInputChange}
					onButtonSubmit={this.onButtonSubmit}
				/>
				{/*<FaceRecognition /> */}
			</div>
		);
	}
}

export default App;

