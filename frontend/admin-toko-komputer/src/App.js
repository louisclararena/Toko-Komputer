import React from "react"
import { Switch, Route } from "react-router-dom";
import Login from "./Pages/Login"
import Product from "./Pages/Product"
import Customer from "./Pages/Customer"
import Transaction from "./Pages/Transaction"
import Home from "./Pages/Home"
import Admin from "./Pages/Admin"

export default class App extends React.Component{
  render(){
    return(
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/product" component={Product} />
        <Route path="/customer" component={Customer} />
        <Route path="/transaction" component={Transaction} />
        <Route path="/admin" component={Admin} />
      </Switch>
    )
  }
}


