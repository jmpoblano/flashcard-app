import React, {useEffect, useState} from 'react'
import {Route, Switch, useRouteMatch, useParams, useHistory} from "react-router-dom"
import DeckView from "./DeckView/DeckView"
import {readDeck, updateDeck, deleteDeck, listCards, deleteCard} from '../utils/api/index'
import EditDeck from "./EditCreate/EditDeck"
import CardsRouter from "../Cards/CardsRouter"
import Study from "./Study/Study"
import BreadcrumbNav from "../Common/BreadcrumbNav"


function DeckRouter ({decks, deleteDeckHandle}) {
    const { url } = useRouteMatch() //urls for following routes begin with /decks/:deckId/
    const initialDeck = ({name: "Sample", description: "Sample", cards: []})
    const [deck, setDeck] = useState({...initialDeck})
    const navigations = [
        [{name: "Home", route: "/"}, {name: deck.name}],
        [{name: "Home", route: "/"}, {name: deck.name, route: url }, {name: "Study"}],
        [{name: "Home", route: "/"},{name: deck.name, route: `/decks/${deck.id}`}, {name: "Edit Deck"}]
    ]
    const { deckId } = useParams()
    const history = useHistory()
    
    

    useEffect(() => {
        setDeck({...initialDeck})
        const abortController = new AbortController();
        async function loadDeck(){
            try{
                const deckFromAPI = await readDeck(deckId, abortController.signal) 
                setDeck({...deckFromAPI})
                return deckFromAPI
            }catch(err){
                if(err.name !== "AbortError"){
                    throw err;
                }
            }
        }
        loadDeck()
        return () => abortController.abort()
    }, [deckId])    

    // handles update deck 
    const editDeckHandle = async (updatedDeck) => {
        const {newName, newDescription} = await updateDeck(updatedDeck)
        console.log(newName, newDescription);
        history.push(url)
    }

    const deleteCardHandle = async (cardId) => {
        const reply = window.confirm("Are you sure you want to delete this card?")
        if (reply){
            await deleteCard(cardId)
        }
    }

    return (
        <Switch>
            <Route exact={true} path={url} >
                <BreadcrumbNav namesRoutes={navigations[0]} />
                <DeckView deck={deck} deleteDeckHandle={deleteDeckHandle} deleteCardHandle={deleteCardHandle} />
            </Route>
            <Route path={`${url}/study`} >
                <BreadcrumbNav namesRoutes={navigations[1]} />
                <Study deck={deck} />
            </Route>
            <Route path={`${url}/edit`} >
                <BreadcrumbNav namesRoutes={navigations[2]} />
                <EditDeck deck={deck} update={editDeckHandle}/>
            </Route>  
            <Route path={`${url}/cards`} >
                <CardsRouter deck={deck} />
            </Route>
        </Switch>
    )
}

export default DeckRouter