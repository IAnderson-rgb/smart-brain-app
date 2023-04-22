import React from "react";
import Tilt from 'react-parallax-tilt';
import brain from './brain1-100.png';
import './Logo.scss';

const Logo = () => {

  return (
		<div className='ma4 mt0'>
			<Tilt
				className='Tilt shadow-2 parallax-effect-glare-scale'
				option={{ max: 55 }}
				perspective={500}
				glareEnable={true}
				glareMaxOpacity={0.45}
				scale={1.02}
			>
				<div className='inner-element'>
					<h1><img src={brain} alt='SmartBrain Logo'></img></h1>
				</div>
			</Tilt>
		</div>
	); 
}

export default Logo;