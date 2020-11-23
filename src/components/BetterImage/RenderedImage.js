import React from 'react';

export default class BetterImage extends React.Component {

  render(){
    {console.log("child rendered source", this.props.sourceRoute)}

    return(
      <div>
        {/* {resizeFunc(resize, source)} */}
          <img src={this.props.sourceRoute}   />
        {/* style={{width: `${resizedImageWidth}px`, height: `${resizedImageHeight}px`}} */}
      </div>
    )
  }
    
}



