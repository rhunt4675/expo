# expo-document-picker

`expo-document-picker` module provides access to the system's UI for selecting documents from the available providers on the user's device.

## Installation

*If your app is running in [Expo](https://expo.io) then everything is already set up for you, just `import { DocumentPicker } from 'expo';`*

Otherwise, you need to install the package from `npm` registry:

`yarn add expo-document-picker` or `npm install expo-document-picker`

Also, make sure that you have dependecies like [expo-core](https://github.com/expo/tree/master/packages/expo-core) installed.

#### iOS

Add the dependency to your `Podfile`:

```ruby
pod 'EXDocumentPicker', path: '../node_modules/expo-document-picker/ios'
```

and run `pod install` under the parent directory of your `Podfile`.

#### Android

1.  Append the following lines to `android/settings.gradle`:
    ```gradle
    include ':expo-document-picker'
    project(':expo-document-picker').projectDir = new File(rootProject.projectDir, '../node_modules/expo-document-picker/android')
    ```
2.  Insert the following lines inside the dependencies block in `android/app/build.gradle`:
    ```gradle
    compile project(':expo-document-picker')
    ```
3.  Add `new DocumentPickerPackage()` to your module registry provider in `MainApplication.java`.

## Usage

```javascript
import React from 'react';
import { Button, View, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

export default class App extends React.Component {
  pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync();
    alert(result.uri);
    console.log(result);
	}

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>'expo-document-picker' example</Text>
        <Button
          title="Select Document"
          onPress={this.pickDocument}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
});
```

## API & further documentation

See [Expo docs](https://docs.expo.io/versions/latest/sdk/document-picker) for this universal module API documentation.
