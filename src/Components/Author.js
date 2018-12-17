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

class Author extends Component {
  constructor(props) {
    super(props)

    this.state = {
      error: false,
      isLoading: false,
      photos: [],
      loadTime: 1,
      filteredPhotos: [],
    }

    window.onscroll = () => {
      const {
        loadDogs,
        search,
        state: { error, isLoading },
      } = this

      if (error || isLoading) return

      if (
        window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 2 &&
        navigator.onLine &&
        !search.current.value
      ) {
        loadDogs()
      }
    }

    this.search = React.createRef()
  }

  componentWillMount() {
    if (navigator.onLine) {
      this.loadDogs()
    } else {
      this.setState({
        photos: JSON.parse(localStorage.getItem('photos')),
        filteredPhotos: JSON.parse(localStorage.getItem('filteredPhotos')),
      })
    }
  }

  loadDogs = () => {
    const api = `https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=888315f85320878f33df15f17795be6e&user_id=${
      this.props.match.params.owner
    }&extras=owner_name%2Cdate_upload%2Cdescription%2Coriginal_format&per_page=100&format=json&nojsoncallback=1&page=${
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
            author: response.data.photos.photo[0].ownername,
          })
          localStorage.setItem('photos', JSON.stringify(this.state.photos))
          localStorage.setItem('filteredPhotos', JSON.stringify(this.state.filteredPhotos))
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
    const { error, isLoading, photos, author, filteredPhotos } = this.state
    const { classes } = this.props

    return (
      <div className="dogs">
        {photos.length === 0 ? (
          <LinearProgress className={classes.loader} color="secondary" />
        ) : (
          <div>
            <Typography variant="h3" gutterBottom className={classes.pageName}>
              Dogs photos by {author}
            </Typography>

            <form onSubmit={this.handleSearch}>
              <input style={{ width: '100%', height: '25px' }} ref={this.search} placeholder="Search photos..." />
              <button type="submit">Search</button>
            </form>

            <Grid container direction="row" justify="space-around" alignItems="center">
              {filteredPhotos.length > 1 ? (
                filteredPhotos.map(photo => <DogsList key={photo.id} {...photo} />)
              ) : (
                <h3>
                  No photos for search '{this.search.current.value}' in {author} profile
                </h3>
              )}
            </Grid>

            {error && (
              <Typography variant="h4" style={{ color: 'red' }}>
                No more photos by this author
              </Typography>
            )}
            {isLoading && <CircularProgress className={classes.photosLoader} color="secondary" />}
          </div>
        )}
      </div>
    )
  }
}

export default withStyles(styles)(Author)
