import React from "react";
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, box }) => {
	return (
		<div className='center ma buffer'>
			<div className='absolute-container'>
				<div className='mt2'>
					<img
						id='inputimage'
						alt=''
						src={imageUrl}
						width='512px'
						height='auto'
					/>
					<div
						className='bounding-box'
						style={{
							top: box.topRow,
							right: box.rightCol,
							bottom: box.bottomRow,
							left: box.leftCol,
						}}
					></div>
				</div>
			</div>
		</div>
	);
};

export default FaceRecognition;