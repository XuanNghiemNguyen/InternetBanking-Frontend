import React, { Component } from 'react'
import LeftMenu from './left.js'
import RightMenu from './right.js'
import { Link } from 'react-router-dom'
import logo from './logo.png'

const Navbar = () => {
  return (
    <nav className='menuBar'>
      <div className='menuCon'>
        <div className='leftMenu'>
          <Link
            className='nav-link'
            to={'/'}
            style={{ paddingRight: 20, paddingLeft: 20 }}
          >
            <img alt='Brand' src={logo}></img>
          </Link>
          <LeftMenu />
        </div>
        <div className='rightMenu'>
          <RightMenu />
        </div>
      </div>
    </nav>
  )
}
export default Navbar
