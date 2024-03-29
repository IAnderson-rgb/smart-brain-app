import React, { Component } from 'react';
import Navigation from './Components/Navigation/Navigation.js';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition.js';
import Logo from './Components/Logo/Logo.js';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm.js';
import Rank from './Components/Rank/Rank.js';
import SignIn from './Components/SignIn/SignIn.js';
import Register from './Components/Register/Register.js';
import Particles from './Components/Particle/Particles.jsx'
import './App.css'; 

const initialState = {
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

class App extends Component {
	constructor() {
		super();
		this.state = initialState;
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
		console.log('Box =', box);
		this.setState({ box: box });
	};

	onInputChange = (event) => {
		this.setState({ input: event.target.value });
	};

	onButtonSubmit = () => {
		this.setState({ imageUrl: this.state.input });
		const IMAGE_URL = this.state.input;
		// const IMAGE_BYTES_STRING = this.state.input;
			fetch(`https://myface-detect-app-api.onrender.com/imageurl`, {
				method: 'post',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					imgLocation: IMAGE_URL,
				}),
			})
			.then((res) => res.json())
			.then((result) => {
				if (result) {
					fetch(`https://myface-detect-app-api.onrender.com/image`, {
						method: 'put',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							id: this.state.user.id,
						}),
					})
						.then((response) => response.json())
						.then((count) => {
							this.setState(Object.assign(this.state.user, { entries: count }));
						})
						.catch((error) => console.log('error', error));
				}
				this.displayFaceBox(this.calculateFaceLocation(result));
			})
			// .then(modelData => console.log('ModelData',modelData.outputs[0].data.regions[0].region_info.bounding_box
			// 	))
			.catch((error) => console.log('error', error));
	};

	onRouteChange = (route) => {
		if (route === 'signout') {
			this.setState(initialState);
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

