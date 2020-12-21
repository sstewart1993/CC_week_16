import React from 'react';
import Pirate from './Pirate.js';


const PirateList = ({pirates}) => {

	if (pirates.length === 0){
	  return (<p>Loading...</p>)
	}

	const piratesNodes = pirates.map((pirate, index) => {
	  return (
	    <li key={index} className="component-item">
	    <div className="component">
	    <Pirate pirate={pirate} />
	    </div>
	    </li>
	  )
	})

	return (
	  <ul className="component-list">
	    {piratesNodes}
	  </ul>
	)
}
 export default PirateList;
