import React from 'react'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'

const styles = {
  card: {
    maxWidth: 300,
    margin: 20,
  },
  media: {
    height: 140,
  },
  title: {
    fontSize: 14,
  },
}

const DogsList = ({
  classes,
  title,
  ownername,
  owner,
  description,
  dateupload,
  farm,
  server,
  id,
  secret,
  original_format,
}) => {
  const image = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.${
    original_format ? original_format : 'jpg'
  }`

  return (
    <Grid item xm={3} className={classes.grid}>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            <Link to={`/${owner}`}>{ownername}</Link> – <strong>{new Date(dateupload * 1000).toLocaleString()}</strong>
          </Typography>
          <CardMedia className={classes.media} image={image} title={title} />
          <Typography>
            {/\S/.test(description._content) ? `Description: ${description._content}` : 'No Description'}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default withStyles(styles)(DogsList)
