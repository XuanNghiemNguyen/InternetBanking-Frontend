import React from 'react'
import './App.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Navbar from './pages/layout/nav'
import { Layout } from 'antd'
import HomePage from './pages/homepage'
import LoginPage from './pages/login'
import ForgotPassword from './pages/forgotPassword'
const { Header, Content, Footer } = Layout

class App extends React.Component {
  render() {
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
                <Route path='/login'>
                  <LoginPage />
                </Route>
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
}

export default App
