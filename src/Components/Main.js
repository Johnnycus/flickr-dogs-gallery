import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Dogs from './Dogs'
import Author from './Author'

const Main = () => (
  <Switch>
    <Route exact path="/" component={Dogs} />
    <Route path="/:owner" component={Author} />
  </Switch>
)

export default Main
