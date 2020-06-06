import React from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import Navbar from './pages/layout/nav'
import { Layout } from 'antd'
import HomePage from './pages/homepage'
import LoginPage from './pages/login'
import ForgotPassword from './pages/forgotPassword'
import ListAccount from './pages/listAccount'
const { Header, Content, Footer } = Layout

const App = () => {
  return (
    <Router>
      <div className='App'>
        <Layout>
          <Header className='header'>
            <div className='logo' />
            <Navbar />
          </Header>
          <Content className='mainBody'>
            <Switch>
              <Route exact path='/' component={HomePage} />
              <Route path='/home'>
                <HomePage />
              </Route>
              <Route
                path='/login'
                render={(props) => {
                  return localStorage.getItem('loggedIn') === 'true' ? (
                    <Redirect to='/' />
                  ) : (
                    <LoginPage {...props} />
                  )
                }}
              ></Route>
              <Route
                path='/listAccount'
                render={(props) => {
                  return localStorage.getItem('loggedIn') === 'true' ? (
                    <ListAccount {...props} />
                  ) : (
                    <LoginPage {...props} />
                  )
                }}
              ></Route>
              <Route path='/forgot-password'>
                <ForgotPassword />
              </Route>
            </Switch>
          </Content>
          <Footer className='x-footer'>Sacombank @ Internet Banking</Footer>
        </Layout>
      </div>
    </Router>
  )
}

export default App
