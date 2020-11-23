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
      sourceRoute: '',
      resultComponent: '',
    }
    this.importAll = this.importAll.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.renderFinal = this.renderFinal.bind(this);
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
    console.log("in import All")
    let images = {};
    r.keys().map((item) => { images[item.replace('./', '')] = r(item); });
    return images;
  }

  async fetchData() {
    if(this.state.fetched === false ){
      console.log("fetching....")
      fetch('/api/convert', {
        method: 'POST',
        headers: {
           'Content-Type': 'application/json' 
           },
          body: JSON.stringify({
            imageName: this.state.source.split("/").pop().replace(/\.(.*)\.(.*)/, ""),
            quality: this.state.quality,
          })
      }).then((data) => {
        console.log("data status from backend", data["ok"])
        // set state after image is available
        if( data["ok"] === true ) {
          // set state
          this.setState( { ...this.state, imageName: this.state.source.split("/").pop().replace(/\.(.*)\.(.*)/, ""), fetched: true, sourceRoute: this.importAll(require.context('./convertedImage', false, /\.(png|jpe?g|webp|svg)$/)), dataOk: true}, () => {
            console.log("fetched is true", this.state)
          }) // callback
        }
      })
      .catch( console.log("in catch") )
    }
    else{ console.log("I'm out of fetch when re-entered") }
  }

  async enterHere(){
      console.log("in enterHere")
      // fetch once
      await this.fetchData()
  }

  async renderFinal() {
    console.log("in renderFinal", this.state.sourceRoute)
    return <RenderedImage sourceRoute={this.state.sourceRoute[`${this.state.imageName}.webp`]} />
  }

  componentDidMount(){
    this.enterHere()
  }
  
  render(){
    console.log("in render", this.state.sourceRoute)
    let finalRender = this.state.sourceRoute[`${this.state.imageName}.webp`];

    return (
      <section>
        {console.log("in return", this.state.sourceRoute[`${this.state.imageName}.webp`])}

        {finalRender ? <RenderedImage sourceRoute={finalRender} /> : <Loading />}
      </section>
    );
  }
}
