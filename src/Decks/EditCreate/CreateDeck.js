import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { createDeck } from '../../utils/api/index'
import BreadcrumbNav from "../../Common/BreadcrumbNav"
import DeckForm from "./DeckForm"

function CreateDeck (){
    const initialFormState = {name: "", description: "", cards: []}
    const [newDeck, setNewDeck] = useState({...initialFormState})
    const navigation = [{name: "Home", route: "/"}, {name: "Create Deck"}]
    const history = useHistory()

    //Event Handlers
    const handleUpdate = ({target}) => setNewDeck({...newDeck, [target.name]: target.value})
    
    const handleSubmit = async (event) => {
        event.preventDefault()
        const {id} = await createDeck(newDeck)
        setNewDeck({...initialFormState})
        history.push(`/decks/${id}`)
    }
    
    const handleCancel = () => {
        setNewDeck({...initialFormState})
        history.push("/")
    }

    return (
        <React.Fragment>
            <BreadcrumbNav namesRoutes={navigation} />
            <h2>Create Deck</h2>
            <DeckForm deckChange={newDeck} submit={handleSubmit} cancel={handleCancel} update={handleUpdate}/>
        </React.Fragment>
    )
}

export default CreateDeck