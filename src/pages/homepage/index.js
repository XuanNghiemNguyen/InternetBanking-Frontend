import React, { Component } from 'react'
import { Spin } from 'antd'
// import {
//   InfoCircleOutlined,
//   LikeOutlined,
//   ShoppingOutlined
// } from '@ant-design/icons'

// import { API } from '../../config/api'

// const { Meta } = Card

// const gridStyle = {
//   width: '25%',
//   textAlign: 'left'
// }

class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      listProduct: []
    }
  }

  render() {
    return (
      <>
        {this.state.listProduct.length === 0 ? (
          <Spin size='large' tip='Loading...' style={{ margin: 'auto' }} />
        ) : (
          <div>
            <h1>HomePage</h1>
          </div>
        )}
      </>
    )
  }
}

export default HomePage
