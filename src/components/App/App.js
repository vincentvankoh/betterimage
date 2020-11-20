import React, { Component } from 'react';
import BetterImage from '../BetterImage/BetterImage.js';
import originalImage from './images/bestPhotoEver.png';
import bigJPGImage from './images/bigJPG.jpg'
import bigPNGImage from './images/bigPNG.png'

class App extends Component {

  render() { 
    return (
      <div>
        <BetterImage
          source={bigPNGImage}
          resize={'200x200'}
          format={'webp'}
          quality={'10'}
        />
      </div>
    );
  }
}

export default App;
