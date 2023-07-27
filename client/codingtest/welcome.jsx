import React from 'react'



export const welcome = () => {
    const username = localStorage.getItem('username')
  return (
    <div>`welcome ${username}`</div>
  )
}
