import React from 'react';
import RenderedImage from './RenderedImage.js';
import Loading from "./Loading.js";

export default class BetterImage extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      resize: this.props.resize,
      source: this.props.source,
      imageName: '',
      format: this.props.format,
      quality: this.props.quality,
      extension: this.props.source.split('/').pop().split('.').pop().split('.').shift(),
      fetched: false,
      dataOk: false,
      webpFile: false,
      sourceRoute: '',
      resultComponent: ''
    }
    this.importAll = this.importAll.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.renderFinal = this.renderFinal.bind(this);
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

  async fetchData() {
    if(this.state.fetched === false ){
      console.log("fetching....")
      await fetch('/api/convert', {
        method: 'POST',
        headers: {
           'Content-Type': 'application/json' 
           },
          body: JSON.stringify({
            imageName: this.state.source.split("/").pop().replace(/\.(.*)\.(.*)/, ""),
            quality: this.state.quality,
          })
      }).then((data) => {
        let result = data.json();
        console.log("data status from backend", data["ok"])
        // set state after image is available
        if( data["ok"] === true ) {
          // set state
          this.setState( { ...this.state, fetched: true, sourceRoute: this.importAll(require.context('./convertedImage', false, /\.(png|jpe?g|webp|svg)$/)), webpFile: this.importAll(require.context('./convertedImage', false, /\.(png|jpe?g|webp|svg)$/))[`${this.state.imageName}.webp`], dataOk: true}, () => {
            console.log("fetched is true", this.state)
          }) // callback
        }
      })
      .catch( console.log("in catch") )
    }
    else{ console.log("I'm out of fetch") }
  }

  async enterHere(){
      console.log("in enterHere")
      // fetch once
      await this.fetchData()
  }

  async renderFinal() {
    console.log("in renderFinal")
    return <RenderedImage sourceRoute={this.state.webpFile} />
  }

  componentDidMount(){
    { this.state.webpFile ? this.renderFinal() : this.enterHere()}
  }
  
  render(){
    console.log("in render")
    if(this.state.fetched){
      return <RenderedImage sourceRoute={this.state.webpFile} />
    }
    return (
      <section>
        {console.log("in return")}
        <Loading />
      </section>
    );
  }
}
