import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Button,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  View,
  Platform,
  FlatList,
  TouchableOpacity,
  useAnimatedValue,
  Animated,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import { router } from "expo-router";

export default function App() {
  const [albums, setAlbums] = useState(null);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  async function getAlbums() {
    if (permissionResponse.status !== "granted") {
      await requestPermission();
    }
    const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums: true,
    });
    setAlbums(fetchedAlbums);
  }

  useEffect(() => {
    getAlbums();
  }, [permissionResponse]);

  // fadeAnim will be used as the value for opacity. Initial Value: 0
  const fadeAnim = useAnimatedValue(0);

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    fadeIn();

    return () => {
      fadeOut();
    };
  }, []);

  return (
    <SafeAreaView style={[styles.container]}>
      <StatusBar style="auto" />
      {/* <Animated.View
        style={[
          styles.fadingContainer,
          {
            // Bind opacity to animated value
            opacity: fadeAnim,
          },
        ]}
      >
        <Text style={styles.fadingText}>Fading View!</Text>
      </Animated.View>
      <View style={styles.buttonRow}>
        <Button title="Fade In View" onPress={fadeIn} />
        <Button title="Fade Out View" onPress={fadeOut} />
      </View> */}
      {albums && (
        <FlatList
          data={albums}
          numColumns={2}
          contentContainerStyle={{ gap: 10 }}
          columnWrapperStyle={{ gap: 10 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <Animated.View
                style={[
                  styles.fadingContainer,
                  {
                    // Bind opacity to animated value
                    opacity: fadeAnim,
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: `/${item.title}`,
                      params: { item: JSON.stringify(item) },
                    })
                  }
                  style={{
                    backgroundColor: "#FAF9F6",
                    gap: 5,
                    padding: 8,
                    borderRadius: 10,

                    
                  }}
                >
                  <Text
                    style={{ fontSize: 16, fontWeight: "500" }}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: "400" }}>
                    {item.assetCount}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          }}
          keyExtractor={(item) => item.id}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
  },
  fadingContainer: {
    width: "48%",

    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,

    // elevation: 5,
  },
});
