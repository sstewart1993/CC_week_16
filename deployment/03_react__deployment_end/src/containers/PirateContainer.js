import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import PirateList from '../components/pirates/PirateList';
import PirateDetail from '../components/pirates/PirateDetail';
import PirateForm from '../components/pirates/PirateForm';
import Request from '../helpers/request';

const PirateContainer = () => {
  const [pirates, setPirates] = useState([]);
  const [ships, setShips] = useState([]);
  const [raids, setRaids] = useState([]);

  const requestAll = function(){
    const request = new Request();
    const piratePromise = request.get('/api/pirates')
    const shipPromise = request.get('/api/ships')
    const raidPromise = request.get('/api/raids')

    Promise.all([piratePromise, shipPromise, raidPromise])
    .then((data) => {
        setPirates(data[0]);
        setShips(data[1]);
        setRaids(data[2])
    })
  }

  const findPirateById = function(id){
    return pirates.find((pirate) => {
      return pirate.id === parseInt(id);
    })
  }

  const handleDelete = function(id){
    const request = new Request();
    const url = "/api/pirates/" + id
    request.delete(url)
    .then(() => window.location = "/pirates")
  }

  const handlePost = function(pirate){
    const request = new Request();
    request.post("/api/pirates", pirate)
    .then(() => window.location = '/pirates')
  }

  const handleUpdate = function(pirate){
    const request = new Request();
    request.patch('/api/pirates/' + pirate.id, pirate)
    .then(() => {
      window.location = '/pirates/' + pirate.id
    })
  }


  useEffect(()=>{
    requestAll()
  }, [])

  if(!pirates){
    return null
  }
  return(
      <Router>
      <>
      <Switch>

      <Route exact path = '/pirates/new' render={() =>{
      return <PirateForm ships={ships} onCreate={handlePost}/>
       }}/> 

      <Route exact path="/pirates/:id/edit" render={(props) =>{
        const id = props.match.params.id;
        const pirate = findPirateById(id);
        return <PirateForm pirate={pirate} ships={ships} onUpdate={handleUpdate}/>
      }}/>  


      <Route exact path="/pirates/:id" render={(props) =>{
        const id = props.match.params.id;
        const pirate = findPirateById(id);
        return <PirateDetail pirate={pirate}
        onDelete={handleDelete}
        onUpdate={handleUpdate} 
        raids={raids} 
        />
      }}/>
      

      <Route render={() => {
        return <PirateList pirates={pirates}/>
      }} />

      </Switch>
      </>
      </Router>
  )
}

export default PirateContainer;
