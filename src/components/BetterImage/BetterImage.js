import React from 'react';
import RenderedImage from './RenderedImage.js';

export default class BetterImage extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      resize: this.props.resize,
      source: this.props.source,
      imageName: this.props.source.split("/").pop().replace(/\.(.*)\.(.*)/, ""),
      format: this.props.format,
      quality: this.props.quality,
      extension: this.props.source.split('/').pop().split('.').pop().split('.').shift(),
      fetched: false,
      dataOk: false
    }
    this.importAll = this.importAll.bind(this);
    this.fetchData = this.fetchData.bind(this);
    // this.convertedImg = this.convertedImg.bind(this);
    // this.extractName = this.extractName.bind(this);
  }


  ///////////////////////////* Hoisted Variables */////////////////////////////
  // let resizedImageWidth;
  // let resizedImageHeight;

  /////////////////////////* Image Resize Functionality *////////////////////////
  //  resizeFunc(string) {
  //   let foundX = false;
  //   let num1 = '';
  //   let num2 = '';

  //   for (let i = 0; i < string.length; i++) {
  //     if (string[i] !== 'x' && foundX === false) {
  //       num1 = num1.concat(string[i]);
  //     } else if (string[i] === 'x') {
  //       foundX = true;
  //     } else if (string[i] !== 'x' && foundX === true) {
  //       num2 = num2.concat(string[i]);
  //     }
  //   }
  //   resizedImageHeight = Number(num1);
  //   resizedImageWidth = Number(num2);

  //   return;
  // }
  
  
  ////////////////* Convert Image Format to WEBP Functionality */////////////////

  ////////////////////* converted Images are declared */////////////////////

  ////////////////////* import all images in optimized folder */////////////////////
  importAll(r) {
    let images = {};
    r.keys().map((item) => { images[item.replace('./', '')] = r(item); });
    return images;
  }

  fetchData() {
    if(this.state.fetched === false ){
      console.log("something")
      console.log("fetching....")
      fetch('/api/convert', {
        method: 'POST',
        headers: {
           'Content-Type': 'application/json' 
           },
          body: JSON.stringify({
            imageName: this.state.imageName,
            quality: this.state.quality,
          })
      }).then((data) => {
        let result = data.json();
        console.log("data status from backend", data["ok"])
        if(data["ok"] === true && this.state.dataOk === false) {
          this.setState( { ...this.state, dataOk: true, fetched: true}, () => {console.log("fetched is true")})
        }
      })
      .catch(
        console.log("we are in catch")
      )
    }
    else{
      console.log("I'm out of fetch")
    }
  }
  
  render(){
    let sourceRoutePath = this.importAll(require.context('./convertedImage', false, /\.(png|jpe?g|webp|svg)$/));
    let sourceRoute = sourceRoutePath[[`${(this.state.imageName)}.webp`]];
    let defaultImage = sourceRoutePath["default.png"];
    // console.log("default Image", defaultImage.default)

    // {console.log("rendered", this.state.fetched)}
    // {console.log("source", this.state.source)}

    return (
      <section>
        { sourceRoute && this.state.dataOk === false ? <RenderedImage sourceRoute={sourceRoute} defaultImage={defaultImage} /> : this.fetchData()  }
      </section>
    );
  }
}
