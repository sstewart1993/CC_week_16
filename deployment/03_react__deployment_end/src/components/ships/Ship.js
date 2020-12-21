import React  from 'react';

const Ship = ({ship}) => {

		return (
			<div className="component">
					<p className="name">
						{ship.name}
					</p>
			</div>
		)
	}

export default Ship;
