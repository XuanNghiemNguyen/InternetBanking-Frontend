import React from 'react'
import './App.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Navbar from './pages/layout/nav'
import { Layout } from 'antd'
import HomePage from './pages/homepage'
import LoginPage from './pages/login'

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
          <Content >
            <Switch>
              <Route path='/home'>
                <HomePage />
              </Route>
              {/* <Route path='/'>
                  <HomePage />
                </Route> */}
              <Route path='/login'>
                <LoginPage />
              </Route>
            </Switch>
          </Content>
          <Footer className='x-footer'>Sacombank - Internet Banking</Footer>
        </Layout>
      </div>
    </Router>
  )
}

export default App
