import React from "react";
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { fetchLocationId, fetchWeather } from "./utils/api";
import getImageForWeather from "./utils/getImageForWeather";
import SearchInput from "./components/SearchInput";

export default class App extends React.Component {
  state = {
    error: false,
    loading: false,
    location: "",
    temperature: 0,
    weather: "",
  };

  handleUpdateLocation = (city) => {
    if (!city) return;

    this.setState({loading: true}, async () => {
      try {
        console.log("update");
        const locationId = await fetchLocationId(city);
        console.log("update", locationId);
        const {location, temperature, weather} = await fetchWeather(locationId);
        console.log("update", location, temperature, weather);

        this.setState({
          error: false,
          loading: false,
          location,
          temperature,
          weather,
        });
      } catch (error) {
        this.setState({
          loading: false,
          error: false,
        });
      }
    });
  }

  componentDidMount() {
    this.handleUpdateLocation("San Francisco");
  }

  renderError() {
    return (
      <Text style={[styles.smallText, styles.textStyle]}>
        Could not load weather, please try a different city.
      </Text>
    );
  }

  renderInfo() {
    const {location, temperature, weather} = this.state;
    return (
      <View>
        <Text style={[styles.largeText, styles.textStyle]}>{location}</Text>
        <Text style={[styles.smallText, styles.textStyle]}>{weather}</Text>
        <Text style={[styles.largeText, styles.textStyle]}>{Math.round(temperature)}°</Text>
      </View>
    );
  }

  renderContent() {
    const {error} = this.state;
    return (
      <View>
        {error && this.renderError()}
        {!error && this.renderInfo()}
        <SearchInput
          placeholder="Search any city"
          onSubmit={this.handleUpdateLocation} />
      </View>
    );
  }

  render() {
    const {loading, weather} = this.state;
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding">
        <StatusBar barStyle="light-content" />
        <ImageBackground
          source={getImageForWeather(weather)}
          style={styles.imageContainer}
          imageStyle={styles.image}>
          <View style={styles.detailsContainer}>
            <ActivityIndicator animating={loading} color="white" size="large" />
            {!loading && this.renderContent()}
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#34495E",
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "cover",
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: 20,
  },
  textStyle: {
    textAlign: "center",
    color: "white",
    ...Platform.select({
      ios: {
        fontFamily: "AvenirNext-Regular",
      },
      android: {
        fontFamily: "Roboto",
      },
    }),
  },
  largeText: {
    fontSize: 44,
  },
  smallText: {
    fontSize: 18,
  },
});
