import React from 'react';
import Pirate from "./Pirate";
import {Link} from 'react-router-dom';

const PirateDetail = ({pirate, raids, onDelete, onUpdate}) => {

    if (!pirate){
      return "Loading..."
    }


  const handleDelete = () => {
    onDelete(pirate.id)
  }

  const deleteRaid = (raidIndex) => {
    let copiedPirate = {...pirate}
    copiedPirate.raids.splice(raidIndex, 1)
    onUpdate(pirate)
  }

  const pirateHasRaid = (raid) =>{
    return pirate.raids.some((pirateRaid) => {
      return raid.id === pirateRaid.id
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const index = parseInt(event.target.raids.value)
    const raid = raids[index];
    pirate.raids.push(raid)
    onUpdate(pirate);
  }

  const piratesRaids = pirate.raids.map((raid, index) => {
    return <li key={index}>
    {raid.location}<button onClick={() => deleteRaid(index)}>Delete</button>
    </li>
  })

  const editUrl = "/pirates/" + pirate.id + "/edit"

  const raidOptions = raids.map((raid, index) => {
    if (!pirateHasRaid(raid)){
      return (
        <option key={index} value={index}>{raid.location}</option>
      )
    } else {
      return null
    }
  })


  return (
    <div className = "component">
    <Pirate pirate = {pirate}/>
    <p>Raids:</p>
    <ul>
    {piratesRaids}
    </ul>
    <form onSubmit={handleSubmit}>
    <select name="raids" >
    {raidOptions}
    </select>
    <input type="submit" value="Add Raid"/>
    </form>
    <button onClick={handleDelete}>Delete {pirate.firstName}</button>
    <Link to= {editUrl}><button type="button">Edit {pirate.firstName}</button></Link>
    </div>
  )
}

export default PirateDetail;
