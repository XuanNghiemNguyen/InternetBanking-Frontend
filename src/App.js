import React from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import Navbar from './pages/layout/nav'
import UNavbar from './pages/userLayout/nav'
import ENavbar from './pages/employeeLayout/nav'
import { Layout } from 'antd'
import GetCodeOTP from './pages/getCodeOTP'
import HomePage from './pages/homepage'
import ChangePassword from './pages/changePassword'
import LoginPage from './pages/login'
import ForgotPassword from './pages/forgotPassword'
import ListAccount from './pages/listAccount'
import ListReceiver from './pages/listReceiver'
import NewUser from './pages/createUser'
const { Header, Content, Footer } = Layout

const App = () => {
  return (
    <Router>
      <div className='App'>
        <Layout>
          <Header className='header'>
          <div className='logo' />
          <Switch>
              <Route path='/' render={(props) => {
                return localStorage.getItem('loggedIn') === 'false'?(
                  <Navbar/>
                ):localStorage.getItem('loggedIn') === 'true' && localStorage.getItem('type')==='normal'?(
                  <UNavbar/>
                ):(
                  <ENavbar/>)
              }}></Route>
             
            </Switch>
          </Header>
          <Content className='mainBody'>
            <Switch>
              <Route exact path='/' component={HomePage} />
              <Route path='/home'>
                <HomePage />
              </Route>
              <Route path='/getOTPCode' render={(props) => <GetCodeOTP {...props} />}>
              </Route>
              <Route
                path='/change-password'
                render={(props) => {
                  return localStorage.getItem('loggedIn') === 'true' ? (
                    <ChangePassword {...props} />
                  ) : (
                    <LoginPage {...props} />
                  )
                }}
              ></Route>
              <Route
                path='/login'
                render={(props) => {
                  return localStorage.getItem('loggedIn') === 'true' ?(
                    <Redirect to='/ ' />
                  ):(
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
              <Route
                path='/createUser'
                render={(props) => {
                  return localStorage.getItem('loggedIn') === 'true' ? (
                    <NewUser {...props} />
                  ) : (
                    <LoginPage {...props} />
                  )
                }}
              ></Route>
              <Route
                path='/listReceiver'
                render={(props) => {
                  return localStorage.getItem('loggedIn') === 'true' ? (
                    <ListReceiver {...props} />
                  ) : (
                    <LoginPage {...props} />
                  )
                }}
              ></Route>
              <Route
                path='/forgot-password'
                render={(props) => {
                  return localStorage.getItem('codeSent') === 'true' ? (
                    <ForgotPassword {...props} />
                  ) : (
                    <GetCodeOTP {...props} />
                  )
                }}
              ></Route>
              <Route
                path='*'
                exact={true}
                render={(props) => <Redirect to='/' {...props} />}
              ></Route>
            </Switch>
          </Content>
          <Footer className='x-footer'>Sacombank @ Internet Banking</Footer>
        </Layout>
      </div>
    </Router>
  )
}

export default App
