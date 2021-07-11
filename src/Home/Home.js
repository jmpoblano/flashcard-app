import React from 'react'
import SingleDeckCard from "./SingleDeckCard"
import {Link } from 'react-router-dom'

function Home({decks, deleteDeckHandler}){

    const list = decks.map((deck) => <SingleDeckCard key={deck.id} deck={deck} deleteHandle={deleteDeckHandler}/>)
    
    return(
        <div>
            <button className="btn btn-secondary" type="button">
                <Link to="/decks/new" className="text-white"> Create Deck</Link>
            </button>
            <ul className="list-group">{list}</ul>
        </div>
    )
}



export default Home