import React, { Component } from 'react'
import axios from 'axios'
import LinearProgress from '@material-ui/core/LinearProgress'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

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
  loader: {
    position: 'absolute',
    margin: 'auto',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
}

class Dogs extends Component {
  state = {
    photos: [],
  }

  componentDidMount() {
    const api =
      'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=888315f85320878f33df15f17795be6e&tags=dog&media=photos&extras=owner_name%2C+date_upload%2C+description%2C+original_format&format=json&nojsoncallback=1'

    axios
      .get(api, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        this.setState({
          photos: response.data.photos.photo,
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    const { photos } = this.state
    const { classes } = this.props

    const DogsList = ({ title, ownername, description, dateupload, farm, server, id, secret, original_format }) => {
      const image = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.${
        original_format ? original_format : 'jpg'
      }`

      return (
        <Grid item xs={3}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                {ownername} – <strong>{new Date(dateupload * 1000).toLocaleString()}</strong>
              </Typography>
              <CardMedia className={classes.media} image={image} title={title} />
              <Typography>Description: {description._content ? description._content : '🐶'}</Typography>
            </CardContent>
          </Card>
        </Grid>
      )
    }

    return (
      <div className="dogs">
        {photos.length === 0 ? (
          <LinearProgress className={classes.loader} color="secondary" />
        ) : (
          <Grid container direction="row" justify="space-around" alignItems="center">
            {photos.map(photo => (
              <DogsList key={photo.id} {...photo} />
            ))}
          </Grid>
        )}
      </div>
    )
  }
}

export default withStyles(styles)(Dogs)
