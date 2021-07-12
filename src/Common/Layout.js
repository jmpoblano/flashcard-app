import React, {useState, useEffect} from "react";
import { listDecks, deleteDeck } from "../utils/api/index"
import Header from "./Header";
import NotFound from "./NotFound";
import Home from "../Home/Home"
import {Route, Switch, useHistory} from "react-router-dom"
import DecksRouter from "../Decks/DecksRouter";

function Layout() {
  const [decks, setDecks] = useState([])
  const history = useHistory()

  useEffect(() =>{
      setDecks([])
      const abortController = new AbortController();
      async function getDecks() {
          try{
              const decksFromAPI = await listDecks(abortController.signal)
              setDecks(decksFromAPI)
          }catch(err){
              if(err.name !== "AbortError"){
                  throw err;
              }
          }
      }
      getDecks()
      
	  return () => abortController.abort()
  }, [])

  // handles button for deleting a deck
  const deleteDeckHandler = async () => {
      const reply = window.confirm("Are you sure you want to delete this deck?")
      if (reply){
          await deleteDeck()
          history.push("/")
      }
  }

  return (
    <div className="app-routes">
      <Header />
      <div className="container">
        <div className="row">
          <div className="column m-auto">
              <Switch>
                <Route exact={true} path ="/">{/*the home screen*/}
                  <Home decks={decks} deleteDeckHandler={deleteDeckHandler}/>
                </Route> 
                <Route path ="/decks"> {/*the decks screen*/}
                  <DecksRouter decks={decks} deleteDeckHandler={deleteDeckHandler}/>
                </Route>
                <Route> 
                  <NotFound />
                </Route>
              </Switch>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout;
