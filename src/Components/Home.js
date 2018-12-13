import React, { Component } from 'react'
import './Home.css'
import axios from 'axios'

class Home extends Component {
  state = {
    photos: [],
  }

  componentDidMount() {
    const api =
      'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=888315f85320878f33df15f17795be6e&tags=dog&media=photos&extras=owner_name%2C+date_upload%2C+description%2C+url_o&format=json&nojsoncallback=1'

    axios
      .get(api, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        const photos = response.data.photos.photo
        console.log(photos)
        this.setState({
          photos,
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header" />
      </div>
    )
  }
}

export default Home
