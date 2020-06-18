import 'react-native-gesture-handler'; // This needs to be first import according to docs
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthScreen from './screens/AuthScreen';
import TabNavigation from './screens/TabNavigation';
import {Alert} from 'react-native';
import Exponea from '../../lib';
import PreloadingScreen from './screens/PreloadingScreen';

interface AppState {
  preloaded: boolean;
  sdkConfigured: boolean;
}

export default class App extends React.Component<{}, AppState> {
  state = {
    preloaded: false,
    sdkConfigured: false,
  };

  componentDidMount(): void {
    Exponea.isConfigured().then((configured) => {
      this.setState({preloaded: true, sdkConfigured: configured});
    });
  }

  render(): React.ReactNode {
    if (!this.state.preloaded) {
      return <PreloadingScreen />;
    }
    return (
      <NavigationContainer>
        {this.state.sdkConfigured ? (
          <TabNavigation />
        ) : (
          <AuthScreen onStart={this.onStart.bind(this)} />
        )}
      </NavigationContainer>
    );
  }

  onStart(projectToken: string, authorization: string, baseUrl: string): void {
    console.log(
      `Configuring Exponea SDK with ${projectToken}, ${authorization} and ${baseUrl}`,
    );
    Exponea.configure({
      projectToken: projectToken,
      authorizationToken: authorization,
      baseUrl: baseUrl,
    })
      .then(() => {
        this.setState({sdkConfigured: true});
      })
      .catch((error) =>
        Alert.alert('Error configuring Exponea SDK', error.message),
      );
  }
}
