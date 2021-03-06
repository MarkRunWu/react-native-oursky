import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput as RNTextInput,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { parsePhoneNumber } from "libphonenumber-js";
import Text from "./Text";
import TextInput, { Props as TextInputProps } from "./TextInput";
import CountryPicker, { Props as CountryPickerProps } from "./CountryPicker";

const defaultStyles = StyleSheet.create({
  box: {
    borderRadius: 24,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    elevation: 15,
    paddingHorizontal: 21,
    paddingVertical: 31,
  },
  description: {
    fontSize: 18,
    lineHeight: 24,
    color: "rgb(51, 51, 51)",
  },
  flexRow: {
    flexDirection: "row",
  },
  title: {
    color: "rgb(63, 68, 165)",
    marginTop: 27,
    fontSize: 24,
  },
  countryPickerContainer: {
    width: 108,
  },
  countryPicker: {
    borderBottomColor: "rgb(170, 170, 170)",
    borderBottomWidth: 1,
    alignSelf: "center",
    height: 52,
  },
  countryPickerText: {
    alignSelf: "center",
    fontSize: 16,
  },
  mobileNumberContainer: {
    marginLeft: 15,
    flex: 1,
  },
  mobileNumberText: {
    height: 52,
    borderBottomColor: "rgb(170, 170, 170)",
    borderBottomWidth: 1,
    fontSize: 16,
  },
  error: {
    paddingVertical: 4,
    color: "rgb(208, 2, 27)",
    fontSize: 13,
  },
  submitButton: {
    marginTop: 41,
    borderColor: "rgb(151, 151, 151)",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  submitText: {
    fontSize: 24,
    color: "rgb(51, 51, 51)",
  },
  skipButton: {
    marginTop: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  skipText: {
    fontSize: 14,
    color: "rgb(63, 68, 165)",
  },
});

export type Mobile = {
  countryCallingCode: string;
  nationalNumber: string;
};

export type Props = {
  style?: StyleProp<ViewStyle>;
  description?: React.ReactNode;
  descriptionStyle?: StyleProp<TextStyle>;
  title?: React.ReactNode;
  titleStyle?: StyleProp<TextStyle>;

  countryPickerProps: CountryPickerProps;
  mobileNumberProps: TextInputProps;

  submitButtonStyle?: StyleProp<ViewStyle>;
  submitButtonText?: React.ReactNode;
  submitButtonTextStyle?: StyleProp<TextStyle>;

  skipButtonStyle?: StyleProp<ViewStyle>;
  skipButtonText?: React.ReactNode;
  skipButtonTextStyle?: StyleProp<TextStyle>;

  loading?: boolean;

  onPressSubmitButton?: (isValid: boolean, mobile: Mobile) => void;
  onPressSkipButton?: () => void;
};

type TextInputRefProps = {
  textInputRef?: React.Ref<RNTextInput>;
};

export default function SignupWithMobile(props: Props & TextInputRefProps) {
  const onChangeText = (text: string) => {
    if (/^\d*$/.test(text)) {
      const { mobileNumberProps } = props;
      if (mobileNumberProps.onChangeText) {
        mobileNumberProps.onChangeText(text);
      }
    }
  };

  const onPressSubmitButton = () => {
    const { onPressSubmitButton } = props;
    const countryCallingCode = props.countryPickerProps.selectedValue || "";
    const nationalNumber = props.mobileNumberProps.value || "";
    try {
      const phoneNumber = parsePhoneNumber(
        `+${countryCallingCode} ${nationalNumber}`
      );
      if (onPressSubmitButton) {
        onPressSubmitButton(phoneNumber ? phoneNumber.isValid() : false, {
          countryCallingCode,
          nationalNumber,
        });
      }
    } catch (e) {
      if (onPressSubmitButton) {
        onPressSubmitButton(false, {
          countryCallingCode,
          nationalNumber,
        });
      }
    }
  };

  const renderCountryPicker = () => {
    const { countryPickerProps } = props;
    return (
      <CountryPicker
        {...countryPickerProps}
        style={[defaultStyles.countryPicker, countryPickerProps.style]}
        containerStyle={[
          defaultStyles.countryPickerContainer,
          countryPickerProps.containerStyle,
        ]}
        textStyle={[
          defaultStyles.countryPickerText,
          countryPickerProps.textStyle,
        ]}
        errorStyle={[defaultStyles.error, countryPickerProps.errorStyle]}
      />
    );
  };

  const renderTextInput = () => {
    const { mobileNumberProps, textInputRef } = props;
    return (
      <TextInput
        {...mobileNumberProps}
        ref={textInputRef}
        containerStyle={[
          defaultStyles.mobileNumberContainer,
          mobileNumberProps.containerStyle,
        ]}
        style={[defaultStyles.mobileNumberText, mobileNumberProps.style]}
        errorStyle={[defaultStyles.error, mobileNumberProps.errorStyle]}
        keyboardType="phone-pad"
        onChangeText={onChangeText}
        autoFocus={true}
      />
    );
  };

  return (
    <View style={[defaultStyles.box, props.style]}>
      <Text style={[defaultStyles.description, props.descriptionStyle]}>
        {props.description}
      </Text>
      <Text style={[defaultStyles.title, props.titleStyle]}>{props.title}</Text>
      <View style={defaultStyles.flexRow}>
        {renderCountryPicker()}
        {renderTextInput()}
      </View>
      <TouchableOpacity
        disabled={props.loading}
        style={[defaultStyles.submitButton, props.submitButtonStyle]}
        onPress={onPressSubmitButton}
      >
        <Text style={[defaultStyles.submitText, props.submitButtonTextStyle]}>
          {props.submitButtonText}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[defaultStyles.skipButton, props.skipButtonStyle]}
        onPress={props.onPressSkipButton}
      >
        <Text style={[defaultStyles.skipText, props.skipButtonTextStyle]}>
          {props.skipButtonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
