import React, { Component } from 'react'
import axios from 'axios'
import LinearProgress from '@material-ui/core/LinearProgress'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  grid: {
    marginTop: 75,
  },
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
  photosLoader: {
    width: '250px !important',
    height: '250px !important',
    margin: '-300px auto 0',
    position: 'absolute',
    right: 0,
    left: 0,
    opacity: 0.5,
  },
}

class Dogs extends Component {
  constructor(props) {
    super(props)

    this.state = {
      error: false,
      isLoading: false,
      photos: [],
      loadTime: 1,
    }

    window.onscroll = () => {
      const {
        loadDogs,
        state: { error, isLoading },
      } = this

      if (error || isLoading) return

      if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
        loadDogs()
      }
    }
  }

  componentWillMount() {
    this.loadDogs()
  }

  loadDogs = () => {
    const api = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=888315f85320878f33df15f17795be6e&tags=dog&media=photos&extras=owner_name%2C+date_upload%2C+description%2C+original_format&format=json&nojsoncallback=1&page=${
      this.state.loadTime
    }`

    this.setState({ isLoading: true }, () => {
      axios
        .get(api, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          const morePhotos = response.data.photos.photo
          this.setState({
            isLoading: false,
            photos: [...this.state.photos, ...morePhotos],
            loadTime: this.state.loadTime + 1,
          })
        })
        .catch(err => {
          console.log(err)
          this.setState({ error: err.message, isLoading: false })
        })
    })
  }

  render() {
    const { error, isLoading, photos } = this.state
    const { classes } = this.props

    const DogsList = ({ title, ownername, description, dateupload, farm, server, id, secret, original_format }) => {
      const image = `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.${
        original_format ? original_format : 'jpg'
      }`

      return (
        <Grid item xm={3} className={classes.grid}>
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
          <div>
            <Grid container direction="row" justify="space-around" alignItems="center">
              {photos.map(photo => (
                <DogsList key={photo.id} {...photo} />
              ))}
            </Grid>
            {error && <div>{error}</div>}
            {isLoading && <CircularProgress className={classes.photosLoader} color="secondary" />}
          </div>
        )}
      </div>
    )
  }
}

export default withStyles(styles)(Dogs)
