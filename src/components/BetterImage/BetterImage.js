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
      finalState: ''
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
    console.log(substring2);
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
  convertImg(quality){
    let imageName = this.state.imageName;
    
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
  // before render
    // componentWillMount was here

  componentDidMount() {
    console.log("sourceName", this.state.source)
    const newName = this.extractName(this.state.source);
    console.log("newName", newName) // working

    console.log("pre-state", this.state)
    console.log("pre-imageName", this.state.imageName)
    this.setState({imageName: newName},()=>console.log('State imageName updated', this.state.imageName)) // not working?
    console.log("post-imageName", this.state.imageName)

    const images = this.importAll(require.context('./convertedImage', false, /\.(png|jpe?g|webp|svg)$/));
    this.setState({images: images})
    if(this.state.once === false){
      this.setState({once: true}, ()=>console.log('State once updated', this.state.imageName));
      this.convertImg(this.state.source, this.state.quality)
      let finalComponent = <img src={this.state.images[`${this.state.imgName}.webp`]} style={{width: `${this.state.resizedImageWidth}px`, height: `${this.state.resizedImageHeight}px`}} alt="image failed to load"/>;
      this.setState({finalState: finalComponent})
  }
}

  ////////////////////* Render the modifed image component */////////////////////
  render(){
    console.log("RENDER imageName", this.state.imgName)
    console.log("RENDER imageDirectory", this.state.images)
    console.log("RENDER finalState", this.state.finalState)
    
    return (
      <div>
        {console.log("RENDERED ONCE", this.state.once)}
        {this.state.finalState}
      </div>
    )
  }
}// end of functional component

