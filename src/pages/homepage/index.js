import React, { Component } from 'react'
import { Spin } from 'antd'
import { Carousel } from 'antd'
import slide1 from './slideShow/km1.jpg'
import slide2 from './slideShow/km2.jpg'
import slide3 from './slideShow/km3.jpg'
import slide4 from './slideShow/km4.jpg'
const styles = {
  _home_bodyContent: {
    width: '100vw',
    height: 400
  },
  home_mainContent: {
    paddingTop: 30,
    paddingBottom: 30,
    backgroundColor: 'white'
  },
  spin: { width: '100vw', margin: 'auto' }
}

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
        <Carousel autoplay>
          <div>
            <img style={styles.home_bodyContent} alt='thongtin1' src={slide1}></img>
          </div>
          <div>
            <img style={styles.home_bodyContent} alt='thongtin2' src={slide2}></img>
          </div>
          <div>
            <img style={styles.home_bodyContent} alt='thongtin3' src={slide3}></img>
          </div>
          <div>
            <img style={styles.home_bodyContent} alt='thongtin4' src={slide4}></img>
          </div>
        </Carousel>
        <div style={styles.home_mainContent}>
          {this.state.listProduct.length === 0 ? (
            <Spin size='large' tip='Loading...' style={styles.spin} />
          ) : (
            <div>
              <h1>HomePage</h1>
            </div>
          )}
        </div>
      </>
    )
  }
}

export default HomePage
