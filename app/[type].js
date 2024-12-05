import { useLocalSearchParams } from "expo-router";
import * as React from "react";
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";

import * as MediaLibrary from "expo-media-library";
import ImageCard from "../components/ImageCard";
import { Feather } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const colors = {
  black: "#323F4E",
  red: "#F76A6A",
  text: "#ffffff",
};

const timers = [...Array(13).keys()].map((i) => (i === 0 ? 1 : i * 5));
const ITEM_SIZE = width - 30;
const ITEM_SPACING = width - ITEM_SIZE;

const PhotosList = () => {
  const { type, item } = useLocalSearchParams();
  const album = JSON.parse(item);

  const [assets, setAssets] = React.useState([]);
  const [videoSource, setVideoSource] = React.useState("");
  const [isGrid, setIsGrid] = React.useState(false);

  React.useEffect(() => {
    async function getAlbumAssets() {
      const albumAssets = await MediaLibrary.getAssetsAsync({
        first: 1000,
        album,
        mediaType: ["video", "photo", "audio", "unknown"],
      });
      setAssets(albumAssets.assets);
    }
    getAlbumAssets();
  }, [type]);

  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const timerValue = React.useRef(new Animated.Value(height)).current;
  const textAnimatedValue = React.useRef(new Animated.Value(height)).current;
  const [duration, setDuration] = React.useState(timers[0]);
  const ref = React.useRef();
  const scrollX = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const listener = textAnimatedValue.addListener(({ value }) => {
      ref?.current?.setNativeProps({
        text: value < 0.1 ? "0" : Math.ceil(value).toString(),
      });
    });

    return () => {
      timerValue.removeListener(listener);
      timerValue.removeAllListeners();
    };
  }, []);

  const animation = React.useCallback(() => {
    textAnimatedValue.setValue(duration);
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(timerValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
      Animated.parallel([
        Animated.timing(timerValue, {
          toValue: height,
          duration: duration * 1000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(textAnimatedValue, {
          toValue: 0,
          duration: duration * 1000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      ]),
      Animated.delay(100),
    ]).start(() => {
      Vibration.cancel();
      Vibration.vibrate();
      timerValue.setValue(height);
      textAnimatedValue.setValue(duration);
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    });
  }, [duration]);

  const buttonTranslateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 16, fontWeight: "500" }}>{type}</Text>

        <TouchableOpacity onPress={() => setIsGrid((prev) => !prev)}>
          <Feather name="grid" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {isGrid ? (
        <FlatList
          data={assets}
          numColumns={3}
          contentContainerStyle={{ gap: 10 }}
          columnWrapperStyle={{ gap: 10 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            if (item.mediaType === "video") {
              setVideoSource(item.uri);
            }
            return (
              <ImageCard
                item={item}
                videoSource={videoSource}
                isGrid={isGrid}
              />
            );
          }}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Animated.FlatList
          showsHorizontalScrollIndicator={false}
          data={assets}
          keyExtractor={(item, index) => index}
          horizontal
          snapToInterval={ITEM_SIZE}
          decelerationRate="fast"
          style={{ flexGrow: 0, opacity }}
          onMomentumScrollEnd={(e) => {
            setDuration(
              timers[Math.round(e.nativeEvent.contentOffset.x / ITEM_SPACING)]
            );
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          bounces={false}
          renderItem={({ item, index }) => {
            const inputRange = [
              (index - 1) * ITEM_SIZE,
              index * ITEM_SIZE,
              (index + 1) * ITEM_SIZE,
            ];
            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.7, 1, 0.7],
              extrapolate: "clamp",
            });
            const rotateY = scrollX.interpolate({
              inputRange,
              outputRange: ["45deg", "0deg", "-45deg"],
              // extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp",
            });
            return (
              <View style={{ width: ITEM_SIZE }}>
                <View
                  style={{
                    display: "flex",
                    flex: 1,
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ textAlign: "center" }}>{`${index + 1}/${
                    assets.length
                  }`}</Text>
                </View>
                <Animated.View
                  style={{
                    alignItems: "center",
                    opacity,
                    transform: [
                      {
                        perspective: ITEM_SIZE,
                      },
                      {
                        scale,
                      },
                      {
                        rotateY,
                      },
                    ],
                  }}
                >
                  <ImageCard
                    item={item}
                    videoSource={videoSource}
                    isGrid={isGrid}
                  />
                </Animated.View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export default PhotosList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9F6",
    paddingHorizontal: 15,
    gap: 10,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
