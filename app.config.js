module.exports = {
  expo: {
    name: "ClyftApp",
    slug: "ClyftApp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    extra: {
      GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY,
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anonymous.ClyftApp",
      config: {
        googleMapsApiKey: process.env.GOOGLE_PLACES_API_KEY,
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.anonymous.ClyftApp",
      googleServicesFile: "./android/app/google-services.json",
      config: {
        googleMaps: {
          apiKey: process.env.API_KEY
        }
      }
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    }
  }
};
