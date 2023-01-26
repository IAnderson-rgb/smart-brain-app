import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg'
import './App.css'; 

class App extends Component {
	constructor() {
		super();
		this.state = {
			input: '',
			imageUrl: '',
		};
	}

	onInputChange = (event) => {
		this.setState({input: event.target.value});
	};

	onButtonSubmit = () => {
		this.setState({imageUrl: this.state.input});
		const MODEL_ID = 'face-detection';
		// const MODEL_VERSION_ID = 'aa7f35c01e0642fda5cf400f543e7c40';
		const IMAGE_URL = this.state.input;
		const raw = JSON.stringify({
			inputs: [
				{
					data: {
						image: {
							url: IMAGE_URL,
						},
					},
				},
			],
		});

		const requestOptions = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				Authorization: 'Key ' + 'c30c2fb50a9a45d08978d7e69a4457a9',
			},
			body: raw,
		};

		fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
        .then(response => response.json())
        .then(result => console.log(result.outputs[0].data.regions[0].region_info.bounding_box
					))
        .catch(error => console.log('error', error));

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
				<FaceRecognition imageUrl={this.state.imageUrl}/>
			</div>
		);
	}
}

export default App;

