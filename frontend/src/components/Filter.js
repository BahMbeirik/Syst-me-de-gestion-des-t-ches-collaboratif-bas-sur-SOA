import React from 'react'

const Filter = ({handleFilterText}) => {
  return (
    <div className="container" style={{width: "500px", margin: "20px auto"}}>
        <select className="form-select" aria-label="Default select example"
        onChange={(e) => handleFilterText(e.target.value)}
        style={{height: "50px"}}>
          <option selected>Filter Tâches</option>
          <option value="FINISHED">finished</option>
          <option value="IN PROGRESS">in progress</option>
          <option value="TO DO">to do</option>
        </select>
      </div>
  )
}

export default Filter