import React, { Component } from 'react'
import axios from 'axios'
import LinearProgress from '@material-ui/core/LinearProgress'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import DogsList from './DogsList'

const styles = {
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
  pageName: {
    marginTop: 75,
    textAlign: 'center',
  },
}

class Dogs extends Component {
  constructor(props) {
    super(props)

    this.state = {
      error: false,
      isLoading: false,
      loadTime: 1,
      photos: [],
      filteredPhotos: [],
    }

    window.onscroll = () => {
      const {
        loadDogs,
        state: { error, isLoading },
      } = this

      if (error || isLoading) return

      if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 2 && navigator.onLine) {
        loadDogs()
      }
    }

    this.search = React.createRef()
  }

  componentWillMount() {
    if (navigator.onLine) {
      this.loadDogs()
    } else {
      this.setState({ photos: JSON.parse(localStorage.getItem('photos')) })
    }
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
            filteredPhotos: [...this.state.photos, ...morePhotos],
            loadTime: this.state.loadTime + 1,
          })
          localStorage.setItem('photos', JSON.stringify(this.state.photos))
        })
        .catch(err => {
          console.log(err)
          this.setState({ error: err.message, isLoading: false })
        })
    })
  }

  handleSearch = e => {
    e.preventDefault()
    const search = this.search.current.value
    const photos = this.state.photos.filter(photo => {
      const photoDescription = photo.description._content.toLowerCase()
      return photoDescription.indexOf(search.toLowerCase()) !== -1
    })
    this.setState({
      filteredPhotos: search ? photos : this.state.photos,
    })
  }

  render() {
    const { error, isLoading, photos, filteredPhotos } = this.state
    const { classes } = this.props

    return (
      <div className="dogs">
        {photos.length === 0 ? (
          <LinearProgress className={classes.loader} color="secondary" />
        ) : (
          <div>
            <Typography variant="h3" gutterBottom className={classes.pageName}>
              Dogs photos from Flickr
            </Typography>

            <form onSubmit={this.handleSearch}>
              <input style={{ width: '100%', height: '25px' }} ref={this.search} placeholder="Search photos..." />
              <button type="submit">Search</button>
            </form>

            <Grid container direction="row" justify="space-around" alignItems="center">
              {filteredPhotos.length > 1 ? (
                filteredPhotos.map(photo => <DogsList key={photo.id} {...photo} />)
              ) : (
                <h3>No photos for search '{this.search.current.value}'</h3>
              )}
            </Grid>

            {error && (
              <Typography variant="h4" style={{ color: 'red' }}>
                No more dogs photos on Flickr
              </Typography>
            )}

            {isLoading && <CircularProgress className={classes.photosLoader} color="secondary" />}
          </div>
        )}
      </div>
    )
  }
}

export default withStyles(styles)(Dogs)
