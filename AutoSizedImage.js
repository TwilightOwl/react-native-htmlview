import React, {PureComponent} from 'react';
import {
  Image,
  Dimensions,
} from 'react-native';


const baseStyle = {
  backgroundColor: 'transparent',
};

export default class AutoSizedImage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // set width 1 is for preventing the warning
      // You must specify a width and height for the image %s
      width: this.props.style.width || 1,
      height: this.props.style.height || 1,
      mount: false
    };
  }

  componentDidMount() {
    Image.getSize(this.props.source.uri, (w, h) => {
      this.setState({width: w, height: h, mount: true});
    });
  }

  render() {
    const finalSize = {
      width: this.state.width,
      height: this.state.height
    };
    const { width, height, ...rest } = this.props.userStyle || {};

    const ratio = finalSize.width / finalSize.height;

    if (finalSize.width > width) {
      finalSize.width = width;
      finalSize.height = finalSize.width / ratio;
    }
    if (finalSize.height > height) {
      finalSize.height = height;
      finalSize.width = finalSize.height * ratio;
    }
    const style = Object.assign(
      baseStyle,
      this.props.style,
      { width: this.state.width, height: this.state.height },
      finalSize,
      (rest || {})
    );
    let source = {};
    if (!finalSize.width || !finalSize.height) {
      source = Object.assign(source, this.props.source, { width: this.state.width, height: this.state.height });
    } else {
      source = Object.assign(source, this.props.source, finalSize);
    }

    return this.state.mount ? <Image style={style} source={source} /> : null;
  }
}
