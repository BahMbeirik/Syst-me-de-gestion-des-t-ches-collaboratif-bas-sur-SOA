import React from 'react'
import Filter from '../components/Filter';
import NoteCardContainer from '../components/NoteCardContainer';
const Home = ({notes, loading,handleFilterText}) => {
  return (
    <div>
      {notes.length <1 ? <h4 style={{textAlign:'center', marginTop:'15px'}}>There is no Sprint found with the search phrase above</h4> :<Filter handleFilterText={handleFilterText}/>}
      <NoteCardContainer notes={notes} loading={loading}/>
    </div>
  )
}

export default Home