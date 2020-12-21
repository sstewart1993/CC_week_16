import React from 'react';
import {Link} from 'react-router-dom';

const Pirate = ({pirate}) => {

  if (!pirate){
    return "Loading..."
  }

  const url = "/pirates/" + pirate.id;

  return (
    <>
    <Link to = {url} className="name">
    {pirate.firstName} {pirate.lastName}
    </Link>
    <p>Age: {pirate.age}</p>
    <p>Ship: {pirate.ship.name}</p>
    </>
  )
}

export default Pirate;
