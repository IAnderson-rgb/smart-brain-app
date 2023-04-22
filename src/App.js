import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Particles from './components/Particle/Particles'
import './App.css'; 

class App extends Component {
	constructor() {
		super();
		this.state = {
			input: '',
			imageUrl: '',
			box: {},
			route: 'signin',
			isSignedIn: false,
			user: {
				id: '',
				name: '',
				email: '',
				entries: 0,
				joined: '',
			},
		};
	}

	loadUser = (data) => {
		this.setState({
			user: {
				id: data.id,
				name: data.name,
				email: data.email,
				entries: data.entries,
				joined: data.joined,
			},
		});
	};

	calculateFaceLocation = (data) => {
		const faceBoundingBox =
			data.outputs[0].data.regions[0].region_info.bounding_box;
		//Will need to iterate over array of regions to bound multiple faces.
		const image = document.getElementById('inputimage');
		const width = Number(image.width);
		const height = Number(image.height);
		return {
			topRow: faceBoundingBox.top_row * width,
			leftCol: faceBoundingBox.left_col * height,
			bottomRow: height - faceBoundingBox.bottom_row * height,
			rightCol: width - faceBoundingBox.right_col * width,
		};
	};

	displayFaceBox = (box) => {
		console.log('Box', box);
		this.setState({ box: box });
	};

	onInputChange = (event) => {
		this.setState({ input: event.target.value });
	};

	onButtonSubmit = () => {
		this.setState({ imageUrl: this.state.input });
		const MODEL_ID = 'face-detection';
		const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
		const IMAGE_URL = this.state.imageUrl;
		// const IMAGE_BYTES_STRING = this.state.input;
		const raw = JSON.stringify({
			"user_app_id": {
				"user_id": "clarifai",
				"app_id": "main"
			},
			"inputs": [
					{
							"data": {
									"image": {
											"url": IMAGE_URL
									}
							}
					}
			]
		});
		
		const requestOptions = {
				method: 'POST',
				headers: {
						'Accept': 'application/json',
						'Authorization': 'Key Your_API_Key'
				},
				body: raw
		};

		fetch(
			'https://api.clarifai.com/v2/models/' +
				MODEL_ID +
				'/versions/' +
				MODEL_VERSION_ID +
				'/outputs',
			requestOptions
		)
			.then((response) => response.json())
			.then((result) => {
				if (result) {
					fetch('http://192.168.1.220:3000/image', {
						method: 'put',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							id: this.state.user.id,
						}),
					})
						.then((response) => response.json())
						.then((count) => {
							this.setState(Object.assign(this.state.user, { entries: count }));
						});
				}
				this.displayFaceBox(this.calculateFaceLocation(result));
			})
			// .then(modelData => console.log('ModelData',modelData.outputs[0].data.regions[0].region_info.bounding_box
			// 	))
			.catch((error) => console.log('error', error));
	};

	onRouteChange = (route) => {
		if (route === 'signout') {
			this.setState({ isSignedIn: false });
			route = 'signin';
		} else if (route === 'home') {
			this.setState({ isSignedIn: true });
		}
		this.setState({ route: route });
	};

	render() {
		const { isSignedIn, route, box, imageUrl } = this.state;
		const { name, entries } = this.state.user;
		return (
			<div className='App'>
				<Particles />
				<Navigation
					onRouteChange={this.onRouteChange}
					isSignedIn={isSignedIn}
				/>
				{route === 'home' ? (
					<div>
						<Logo />
						<Rank 
							userName={name}
							userEntries={entries}
						/>
						<ImageLinkForm
							onInputChange={this.onInputChange}
							onButtonSubmit={this.onButtonSubmit}
						/>
						<FaceRecognition 
							box={box} 
							imageUrl={imageUrl} 
						/>
					</div>
				) : route === 'signin' ? (
					<SignIn 
						onRouteChange={this.onRouteChange}
						loadUser={this.loadUser}
					/>
				) : (
					<Register
						onRouteChange={this.onRouteChange}
						loadUser={this.loadUser}
					/>
				)}
			</div>
		);
	}
}

export default App;

