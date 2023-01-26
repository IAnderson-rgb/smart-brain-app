import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg'
import Clarifai from 'clarifai';
import './App.css'; 

console.log(Clarifai);
const app = new Clarifai.App({
	apiKey: 'c30c2fb50a9a45d08978d7e69a4457a9'
 });
 console.log('This app', app);

class App extends Component {
	constructor() {
		super();
		this.state = {
			input: '',
			imageUrl: '',
		};
	}

	onInputChange = (event) => {
		console.log(event.target.value);
	};

	onButtonSubmit = () => {
		console.log('click');
	    app.models
      .predict( Clarifai.FACE_DETECT_MODEL, 
				'https://samples.clarifai.com/face-det.jpg')
			.then( response => {
				console.log(response);
			});
		};

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
				<FaceRecognition />
			</div>
		);
	}
}

export default App;

