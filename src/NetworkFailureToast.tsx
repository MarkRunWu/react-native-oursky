import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  ImageStyle,
  NetInfo,
  ViewStyle,
  TextStyle,
  StyleProp,
} from "react-native";
import Text from "./Text";
import FadeAnimation from "./FadeAnimation";

const styles = StyleSheet.create({
  safeArea: {
    bottom: 0,
    left: 0,
    right: 0,
    position: "absolute",
    alignItems: "center",
  },
  toastContainer: {
    backgroundColor: "white",
    width: "93%",
    maxWidth: 349,
    height: 65,
    bottom: 69,
    borderColor: "#CACACA",
    borderWidth: 1,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginHorizontal: 14,
  },
  text: {
    fontSize: 14,
    color: "#333333",
  },
  textContainer: {
    flex: 1,
    paddingRight: 14,
  },
});
const defaultIcon = require("./images/ic_toast_offline.png");
const defaultText =
  "Cannot reach internet. Please check your device internet connections.";

interface Props {
  style?: StyleProp<ViewStyle>;
  errorText?: React.ReactNode;
  textStyle?: StyleProp<TextStyle>;
  imageIcon?: any; // FIXME: Change it to ImageSourcePropType after adapting to ts
  iconStyle?: StyleProp<ImageStyle>;
  animationDuration?: number;
}

interface State {
  isNetworkConnected: boolean;
}

export default class NetworkFailureToast extends React.PureComponent<
  Props,
  State
> {
  state = {
    isNetworkConnected: true,
  };

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      "connectionChange",
      this.handleConnectivityChange
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleConnectivityChange
    );
  }

  handleConnectivityChange = (isConnected: boolean) => {
    this.setState({
      isNetworkConnected: isConnected,
    });
  };

  renderErrorText = (
    errorText?: React.ReactNode,
    textStyle?: StyleProp<TextStyle>
  ): React.ReactNode => {
    if (typeof errorText == "string" || errorText == null) {
      const textValue = errorText || defaultText;
      return <Text style={[styles.text, textStyle]}>{textValue}</Text>;
    }

    return errorText;
  };

  render() {
    const { isNetworkConnected } = this.state;
    const {
      style,
      errorText,
      textStyle,
      imageIcon,
      iconStyle,
      animationDuration,
    } = this.props;

    return (
      <SafeAreaView style={styles.safeArea} pointerEvents={"box-none"}>
        <FadeAnimation
          visible={!isNetworkConnected}
          duration={animationDuration}
        >
          <View style={[styles.toastContainer, style]}>
            <Image
              style={[styles.icon, iconStyle]}
              source={imageIcon || defaultIcon}
              resizeMode="center"
            />
            <View style={styles.textContainer}>
              {this.renderErrorText(errorText, textStyle)}
            </View>
          </View>
        </FadeAnimation>
      </SafeAreaView>
    );
  }
}
