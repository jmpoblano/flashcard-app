import React, { useState, useEffect } from 'react'
import {readDeck} from '../../utils/api/index'
import { useHistory, useParams } from 'react-router-dom'
import DeckForm from './DeckForm'

function EditDeck({deck, update}){
    const {deckId} = useParams()
    const [updatedDeck, setUpdatedDeck] = useState({...deck})
    const history = useHistory()

    useEffect(() => {
        setUpdatedDeck({...deck})
        const abortController = new AbortController();
        async function loadDeck(){
            try{
                const deckFromAPI = await readDeck(deckId, abortController.signal) 
                setUpdatedDeck({...deckFromAPI})
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

    //Event Handlers
    const handleUpdate = ({target}) => setUpdatedDeck({...updatedDeck, [target.name]: target.value})
    const handleSubmit = async (event) => {
        event.preventDefault()
        await update(updatedDeck)
    }
    const handleCancel = () => {
        // setUpdatedDeck({...deck})
        history.push(`/decks/${deck.id}`)
    }

    return (
        <React.Fragment>
            <h2>Edit Deck</h2>
            <DeckForm deckChange={updatedDeck} submit={handleSubmit} cancel={handleCancel} update={handleUpdate} />
        </React.Fragment>
    )
}

export default EditDeck