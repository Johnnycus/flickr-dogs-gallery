import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'

const styles = {
  root: {
    width: '100%',
  },
  title: {
    width: '60%',
  },
  logo: {
    textDecoration: 'none',
    color: 'white',
  },
}

const Header = ({ classes }) => (
  <div className={classes.root}>
    <AppBar position="fixed">
      <Toolbar>
        <Typography className={classes.title} variant="h6" color="inherit" noWrap>
          <Link to="/" className={classes.logo}>
            Dogs Gallery
          </Link>
        </Typography>
      </Toolbar>
    </AppBar>
  </div>
)

export default withStyles(styles)(Header)
