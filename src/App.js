import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from './components/Particle/Particles'
import './App.css'; 

class App extends Component {
	constructor() {
		super();
		this.state = {
			input: '',
			imageUrl: '',
			box: {},
		};
	}

	// calculateFaceLocation = (data) => {
	// 	const faceBoundingBox =data.outputs[0].data.regions[0].region_info.bounding_box
	// 	const image = document.getElementById('inputimage');
	// 	const width = Number(image.width);
	// 	const height = Number(image.height);
	// 	console.log('Data',faceBoundingBox);
	// 	return{
	// 		leftCol: faceBoundingBox.left_col * width,
	// 		topRow: faceBoundingBox.top_row * height,
	// 		rightCol: width - (faceBoundingBox.right_col * width),
	// 		bottomRow: height + (faceBoundingBox.bottom_row * height)
	// 	}
	// }

	calculateFaceLocation = (data) => {
		const faceBoundingBox =data.outputs[0].data.regions[0].region_info.bounding_box
		const image = document.getElementById('inputimage');
		const width = Number(image.width);
		const height = Number(image.height);
		return{
			topRow: faceBoundingBox.top_row * width,
			leftCol: faceBoundingBox.left_col * height,
			bottomRow: height - (faceBoundingBox.bottom_row * height),
			rightCol: width - (faceBoundingBox.right_col * width)
		}
	}

	displayFaceBox = (box) => {
		console.log('Box', box);
		this.setState({box: box});
	}

	onInputChange = (event) => {
		this.setState({input: event.target.value});
	};

	onButtonSubmit = () => {
		this.setState({imageUrl: this.state.input});
		const MODEL_ID = 'face-detection';
		const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
		const IMAGE_URL = this.state.input;
		// const IMAGE_BYTES_STRING = this.state.input;
		const raw = JSON.stringify({
			"inputs": [
				{
					"data": {
						"image": {
							"url": IMAGE_URL
						},
					},
				},
			],
		});

		const requestOptions = {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Authorization': 'Key c30c2fb50a9a45d08978d7e69a4457a9',
			},
			body: raw,
		};

		fetch("https://api.clarifai.com/v2/models/" 
				 + MODEL_ID 
				 + "/versions/" 
				 + MODEL_VERSION_ID 
				 + "/outputs", requestOptions)
        .then(response => response.json())
        .then(result => this.displayFaceBox(this.calculateFaceLocation(result)))
				// .then(modelData => console.log('ModelData',modelData.outputs[0].data.regions[0].region_info.bounding_box
					// ))
        .catch(error => console.log('error', error));

		};

	render() {
		return (
			<div className='App'>
				<Particles />
				<Navigation />
				<Logo />
				<Rank />
				<ImageLinkForm
					onInputChange={this.onInputChange}
					onButtonSubmit={this.onButtonSubmit}
				/>
				<FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
			</div>
		);
	}
}

export default App;

