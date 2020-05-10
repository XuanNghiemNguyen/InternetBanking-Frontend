import React from 'react'
import './App.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Navbar from './pages/layout/nav'
import { Layout } from 'antd'
import HomePage from './pages/homepage'
import { Carousel } from 'antd'

const { Header, Content, Footer } = Layout

function App() {
  return (
    <Router>
      <div className='App'>
        <Layout>
          <Header className='header'>
            <div className='logo' />
            <Navbar />
          </Header>
          <Content>
            <Carousel autoplay>
              <div>
                <img
                  alt='khuyenmai'
                  src='https://khuyenmai.sacombank.com/Data/Sites/1/News/3250/final_banner-khuyen-mai_1600x660px.jpg'
                ></img>
              </div>
              <div>
                <h3>2</h3>
              </div>
              <div>
                <h3>3</h3>
              </div>
              <div>
                <h3>4</h3>
              </div>
            </Carousel>
            <div className='bodyContent'>
              <Switch>
                <Route path='/home'>
                  <HomePage />
                </Route>
                <Route path='/login'>
                  <HomePage />
                </Route>
                <Route path='/'>
                  <HomePage />
                </Route>
              </Switch>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Sacombank - Internet Banking
          </Footer>
        </Layout>
      </div>
    </Router>
  )
}

export default App
