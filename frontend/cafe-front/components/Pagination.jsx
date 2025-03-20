import React from 'react'
import { Pagination } from '@mui/material'
import '../components/Style/GameCardStyles.css'

const Paginate = ({ gamesPerPage, totalGames, paginate }) => {
  const pageNumber = [];
  for (let i = 1; i <= Math.ceil(totalGames / gamesPerPage); i++) {
    pageNumber.push(i);
  }
  return (
    <nav>
      <Pagination
        count={pageNumber.length}
        onChange={(e, p) => paginate(p)}
      />
    </nav>
  )
}
export default Paginate