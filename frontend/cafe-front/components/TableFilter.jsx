import React from 'react'

export default function TableFilter({ people, seats }) {
    const handleFilterChange = (event) => {
        console.log(event.target.value)

        setShowAll(persons.filter(person => person.name.toLowerCase().includes(event.target.value.toLowerCase())))
    }
    return (
        <div>
            <input onChange={handleFilterChange} />
        </div>
    )
}
