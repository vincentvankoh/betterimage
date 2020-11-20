import React from 'react';

export default class BetterImage extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      once: false,
      resize: this.props.resize,
      source: this.props.source,
      quality: this.props.quality,
      format: this.props.format,
      images: '',
      imageName: '',
      resizedImageHeight: 0,
      resizedImageWidth: 0,
      finalState:''
    }
    this.updateOnce = this.updateOnce.bind(this);
    this.importAll = this.importAll.bind(this);
    this.extractName = this.extractName.bind(this);
    this.resizeFunc = this.resizeFunc.bind(this);
    this.convertImg = this.convertImg.bind(this);
  }

  updateOnce(){
    this.setState({once: true});
    console.log("once is updated", this.state.once)
  };

//////////////////* HELPER fUNCTIONS *///////////////////
    //////////* import all images in optimized folder *//////////
  importAll(r) {
    let images = {};
    r.keys().map((item) => { images[item.replace('./', '')] = r(item); });
    return images;
  };
    
  //////////////////////////* Extract Image Name * ////////////////////
  extractName(string){
    let arr = string.split('').reverse();
    let indexDot = arr.indexOf('.');
    let indexSlash = arr.indexOf('/');
    let substring = arr.join('').substring(indexDot+1, indexSlash);
    let firstString = substring.split("").reverse().join("");
    let arr2 = firstString.split('');
    let secondDot = arr2.indexOf('.');
    let substring2 = arr2.join('').substring(0, secondDot);
    return substring2;
  }

//////////////////* MAIN fUNCTIONS *///////////////////
  /////////////////////////* Image Resize Functionality *////////////////////////
  resizeFunc(string) {
    let foundX = false;
    let num1 = '';
    let num2 = '';

    for (let i = 0; i < string.length; i++) {
      if (string[i] !== 'x' && foundX === false) {
        num1 = num1.concat(string[i]);
      } else if (string[i] === 'x') {
        foundX = true;
      } else if (string[i] !== 'x' && foundX === true) {
        num2 = num2.concat(string[i]);
      }
    }
    this.setState({resizedImageHeight: Number(num1)}) ;
    this.setState({resizedImageWidth: Number(num2)}) ;
    return;
  }

  ////////////////* Convert Image Format to WEBP Functionality */////////////////
  convertImg(source, quality){
    let imageName = this.extractName(source);
    
    if(this.state.once === false){
      
      console.log("inside the fetch block", this.state.once) // false
      
      fetch('/api/convert', {
        method: 'POST',
        headers: {
           'Content-Type': 'application/json' 
           },
          body: JSON.stringify({
            imageName: imageName,
            quality: quality
          })
      }).then(
        (res) => {
          res.json().then(
            (data) => { 
              console.log("fetch object returned", data.invocation)
              this.setState({once: data.invocation})  
              console.log("state once", this.state.once)
            }
          )
        }, 
        (error) => {
          this.setState({
            once: true
          })
        }
      )
    }
  }


///////////////////* CHAINING the APIs Together */////////////////////
  componentDidMount(){
    this.setState({imageName: this.extractName(this.state.source)})
    this.setState({images: this.importAll(require.context('./convertedImage', false, /\.(png|jpe?g|webp|svg)$/))})
    if(this.state.once === false){
      this.setState({once: true});
      this.convertImg(this.state.source, this.state.quality)
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.state.value != nextState.value;
  }

  ////////////////////* Render the modifed image component */////////////////////
  render(){
    let renderingComponent = (
      <img src={this.state.images[`${this.state.imgName}.webp`]} style={{width: `${this.state.resizedImageWidth}px`, height: `${this.state.resizedImageHeight}px`}} alt="image failed to load"/>
    )

    return (
      <div>
        {console.log("rendering", this.state.once)}
        {renderingComponent}
      </div>
    )
  }
}// end of functional component

