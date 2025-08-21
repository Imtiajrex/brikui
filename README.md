# NativeBricks

NativeBricks is a powerful, easy-to-use Tailwind CSS-inspired UI library for React Native, built on top of NativeWind. It allows developers to build beautiful, responsive, and performant mobile interfaces with minimal effort.

## Features

- **Tailwind CSS Support**: Fully compatible with the Tailwind CSS utility class system via NativeWind.
- **Customizable Components**: Pre-built, customizable components to accelerate your development process.
- **Performance-Optimized**: Designed to work seamlessly on iOS and Android with minimal overhead.
- **Accessibility-First**: Built-in accessibility support to ensure inclusivity in your apps.

## Installation

To get started with NativeBricks, install the core package:

```bash
npm install brikui
```

or

```bash
yarn add brikui
```

### Peer Dependencies

Ensure that you have the required peer dependencies installed:

- [React](https://reactjs.org/) >= 17
- [React Native](https://reactnative.dev/) >= 0.68
- [NativeWind](https://www.nativewind.dev/) >= 4.0

Install these dependencies if they are not already part of your project:

```bash
npm install react react-native nativewind
```

or

```bash
yarn add react react-native nativewind
```

## Setup

1. **Tailwind Configuration**:
   Create or update your `tailwind.config.js` file:

   ```javascript
   module.exports = {
     content: [
       './App.{js,jsx,ts,tsx}',
       './src/**/*.{js,jsx,ts,tsx}',
       './node_modules/@brikui/**/*.{js,jsx,ts,tsx}',
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   };
   ```

2. **NativeWind Setup**:
   Follow the NativeWind setup instructions [here](https://www.nativewind.dev/quick-start).

3. **Import NativeBricks Components**:
   Start using pre-built components in your project by importing them from `brikui`:

   ```javascript
   import { Button, Card, Input } from 'brikui';
   ```

## Usage

### Example

Here’s a quick example to demonstrate the power of NativeBricks:

```javascript
import React from 'react';
import { View } from 'react-native';
import { Button, Card, Input, alert } from 'brikui';

const App = () => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <Card className="w-80 p-4">
        <Input placeholder="Enter your name" className="mb-4" />
        <Button
          className="bg-blue-500 text-white"
          onPress={() =>
            alert({
              title: 'Hello, NativeBricks!',
            })
          }
        >
          Click Me
        </Button>
      </Card>
    </View>
  );
};

export default App;
```

## Documentation

Find comprehensive documentation, including component APIs and examples, on the [NativeBricks Documentation Site](https://brikui.dev).

## Roadmap

- Expand the library with more pre-built components.
- Add support for dark mode out of the box.
- Improve documentation with advanced use cases.

## License

NativeBricks is licensed under the [MIT License](LICENSE).

---

Developed with ❤️ by the [Atomicle Labs](https://atomicle.com) team.
