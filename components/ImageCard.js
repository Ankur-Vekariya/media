import {
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { Image } from "expo-image";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

// const videoSource =
//   "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const ImageCard = ({ item, videoSource, isGrid }) => {
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    // player.play();
    // player.muted = true;
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  return (
    <TouchableHighlight
      // onLongPress={() => setOpacity((value) => !value)}
      style={[
        styles.container,
        {
          height: isGrid ? 170 : "95%",
          width: isGrid ? "31%" : "95%",
          backgroundColor: "white",
          borderRadius: 16,
        },
      ]}
    >
      {/* <Text>{item.creationTime}</Text> */}
      {item.mediaType === "photo" ? (
        <Image
          source={{ uri: item.uri }}
          width={"100%"}
          height={"100%"}
          contentFit="cover"
          placeholder={blurhash}
          transition={100}
          style={{
            borderRadius: 16,
            backgroundColor: "white",

            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
          }}
        />
      ) : (
        <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
          contentFit="cover"
        />
      )}
    </TouchableHighlight>
  );
};

export default ImageCard;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  image: {
    width: "100%",
  },
  video: {
    height: "100%",
    width: "100%",

    borderRadius: 16,

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
