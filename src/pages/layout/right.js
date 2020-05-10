import React, { Component } from 'react'
import { Menu, Input } from 'antd'
import { Link } from 'react-router-dom'

const { Search } = Input
const { Item } = Menu

class RightMenu extends Component {
  render() {
    return (
      <Menu mode='horizontal'>
        <Search
          placeholder='Search in Sacombank'
          onSearch={(value) => console.log(value)}
          style={{ width: 0.3 * window.innerWidth, marginRight: 20 }}
        />
        <Item key='login'>
          <Link className='nav-link' to={'/login'}>
            Login
          </Link>
        </Item>
        <Item key='signup'>
          <Link className='nav-link' to={'/signup'}>
            Sign Up
          </Link>
        </Item>
      </Menu>
    )
  }
}
export default RightMenu
