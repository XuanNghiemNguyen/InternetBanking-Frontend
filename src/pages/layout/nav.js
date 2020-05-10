import React, { Component } from 'react'
import LeftMenu from './left.js'
import RightMenu from './right.js'
import { Link } from 'react-router-dom'

class Navbar extends Component {
  render() {
    return (
      <nav className='menuBar'>
        <div className='menuCon'>
          <div className='leftMenu'>
            <Link
              className='nav-link'
              to={'/login'}
              style={{ paddingRight: 20, paddingLeft: 20 }}
            >
              <img
                alt='Brand'
                src='https://www.sacombank.com.vn/Style%20Library/2018/images/logo.png'
              ></img>
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
}
export default Navbar
