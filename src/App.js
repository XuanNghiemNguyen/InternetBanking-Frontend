import React from "react"
import "./App.css"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom"

import { Layout } from "antd"

import {
  Navbar,
  GetCodeOTP,
  HomePage,
  ChangePassword,
  LoginPage,
  ForgotPassword,
  ListAccount,
  ListReceiver,
  InterbankTransfer,
  InternalBankTransfer,
  HistoryReceive,
  HistorySend,
  HistoryDebt,
  DebtReminder,
  DebtList,
  NewUser,
  Deposit,
  SendHistory,
  ReceiveHistory,
  DebtHistory,
  AboutUs,
  ReportTransacion,
  CreateCustomer,
  DepositCustomer,
  HistoryCustomer,
} from "./components/index"
import ManageEmployee from "./pages/Admin/employeeList"
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
              <Route exact path='/aboutUs' component={AboutUs} />
              <Route
                path='/getOTPCode'
                render={(props) => <GetCodeOTP {...props} />}></Route>
              <Route
                path='/internal-bank-transfer'
                render={(props) => {
                  return localStorage.getItem("loggedIn") === "true" ? (
                    <InternalBankTransfer {...props} />
                  ) : (
                    <LoginPage {...props} />
                  )
                }}></Route>
              <Route
                path='/interbank-transfer'
                render={(props) => {
                  return localStorage.getItem("loggedIn") === "true" ? (
                    <InterbankTransfer {...props} />
                  ) : (
                    <LoginPage {...props} />
                  )
                }}></Route>
              <Route
                path='/change-password'
                render={(props) => {
                  return localStorage.getItem("loggedIn") === "true" ? (
                    <ChangePassword {...props} />
                  ) : (
                    <LoginPage {...props} />
                  )
                }}></Route>
              <Route
                path='/login'
                render={(props) => {
                  return localStorage.getItem("loggedIn") === "true" ? (
                    <Redirect to='/' />
                  ) : (
                    <LoginPage {...props} />
                  )
                }}></Route>
              <Route
                path='/listAccount'
                render={(props) => {
                  return localStorage.getItem("loggedIn") === "true" ? (
                    <ListAccount {...props} />
                  ) : (
                    <LoginPage {...props} />
                  )
                }}></Route>
              <Route
                path='/debtReminder'
                render={(props) => {
                  return localStorage.getItem("loggedIn") === "true" ? (
                    <DebtReminder {...props} />
                  ) : (
                    <LoginPage {...props} />
                  )
                }}></Route>
              <Route
                path='/debtList'
                render={(props) => {
                  return localStorage.getItem("loggedIn") === "true" ? (
                    <DebtList {...props} />
                  ) : (
                    <LoginPage {...props} />
                  )
                }}></Route>
              <Route
                path='/listReceiver'
                render={(props) => {
                  return localStorage.getItem("loggedIn") === "true" ? (
                    <ListReceiver {...props} />
                  ) : (
                    <LoginPage {...props} />
                  )
                }}></Route>
              <Route
                path='/transactionReceive'
                render={(props) => {
                  return localStorage.getItem("loggedIn") === "true" ? (
                    <HistoryReceive {...props} />
                  ) : (
                    <LoginPage {...props} />
                  )
                }}></Route>
              <Route
                path='/transactionSend'
                render={(props) => {
                  return localStorage.getItem("loggedIn") === "true" ? (
                    <HistorySend {...props} />
                  ) : (
                    <LoginPage {...props} />
                  )
                }}></Route>
              <Route
                path='/transactionDebt'
                render={(props) => {
                  return localStorage.getItem("loggedIn") === "true" ? (
                    <HistoryDebt {...props} />
                  ) : (
                    <LoginPage {...props} />
                  )
                }}></Route>
              <Route
                path='/listReceiver'
                render={(props) => {
                  return localStorage.getItem("loggedIn") === "true" ? (
                    <ListReceiver {...props} />
                  ) : (
                    <LoginPage {...props} />
                  )
                }}></Route>
              <Route
                path='/employee'
                render={(props) => {
                  return localStorage.getItem("loggedIn") === "true" ? (
                    <ManageEmployee {...props} />
                  ) : (
                    <LoginPage {...props} />
                  )
                }}></Route>
              <Route
                path='/forgot-password'
                render={(props) => {
                  return localStorage.getItem("codeSent") === "true" ? (
                    <ForgotPassword {...props} />
                  ) : (
                    <GetCodeOTP {...props} />
                  )
                }}></Route>
              <Route
                path='/em-createCustomer'
                render={(props) => {
                  return localStorage.getItem("loggedIn") === "true" ? (
                    <CreateCustomer {...props} />
                  ) : (
                    <LoginPage {...props} />
                  )
                }}></Route>
              <Route
                path='/em-depositCustomer'
                render={(props) => {
                  return localStorage.getItem("loggedIn") === "true" ? (
                    <DepositCustomer {...props} />
                  ) : (
                    <LoginPage {...props} />
                  )
                }}></Route>
              <Route
                path='/em-historyCustomer'
                render={(props) => {
                  return localStorage.getItem("loggedIn") === "true" ? (
                    <HistoryCustomer {...props} />
                  ) : (
                    <LoginPage {...props} />
                  )
                }}></Route>
              <Route
                path='/receiveHistory'
                render={(props) => {
                  return localStorage.getItem("loggedIn") === "true" ? (
                    <ReceiveHistory {...props} />
                  ) : (
                    <LoginPage {...props} />
                  )
                }}></Route>
              <Route
                path='/debtHistory'
                render={(props) => {
                  return localStorage.getItem("loggedIn") === "true" ? (
                    <DebtHistory {...props} />
                  ) : (
                    <LoginPage {...props} />
                  )
                }}></Route>
              <Route
                path='/reportTransaction'
                render={(props) => {
                  return localStorage.getItem("loggedIn") === "true" ? (
                    <ReportTransacion {...props} />
                  ) : (
                    <LoginPage {...props} />
                  )
                }}></Route>
              <Route
                path='*'
                exact={true}
                render={(props) => <Redirect to='/' {...props} />}></Route>
            </Switch>
          </Content>
          <Footer className='x-footer'>Sacombank @ Internet Banking</Footer>
        </Layout>
      </div>
    </Router>
  )
}

export default App
