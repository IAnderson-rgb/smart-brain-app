import React from "react";
import './ImageLinkForm.css';

const ImageLinkForm = ({onInputChange, onButtonSubmit}) => {

  return (
		<div>
			<p className='f3 b near-white neonText'>
				{'This Magic Brain will detect faces in your pictures. Give it a try! Simply copy and paste an image URL here, then press detect, and..voilà!'}
			</p>
			<div className='center'>
				<div className='center form pa3 br3 shadow-6'>
					<input className='f4 pa2 w-70 center' type='text' onChange={onInputChange}/>
					<button 
						className='w-30 grow f4 link ml2 ph3 pv2 dib white bg-black-40'
						onClick={onButtonSubmit}>
						Detect
					</button>
				</div>
			</div>
		</div>
	); 
}

export default ImageLinkForm;