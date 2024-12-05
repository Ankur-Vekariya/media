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
} from "react-native";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  const [albums, setAlbums] = useState(null);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  async function getAlbums() {
    console.log("function call 21-------------");

    if (permissionResponse.status !== "granted") {
      await requestPermission();
    }
    const fetchedAlbums = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums: true,
    });
    setAlbums(fetchedAlbums);
  }

  console.log("albums====================32", albums);

  useEffect(() => {
    getAlbums();
  }, [permissionResponse]);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: 40 }]}>
      <StatusBar style="auto" />
      {/* <Button onPress={getAlbums} title="Get albums" /> */}
      {/* <ScrollView> */}
      {albums && (
        <FlatList
          data={albums}
          numColumns={2}
          contentContainerStyle={{ gap: 10 }}
          columnWrapperStyle={{ gap: 10 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  backgroundColor: "white",
                  gap: 5,
                  padding: 8,
                  borderRadius: 10,
                  width: "48%",

                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,

                  elevation: 5,
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
              </View>
            );
          }}
          keyExtractor={(item) => item.id}
        />
      )}
      {albums &&
        albums.map((album, index) => (
          <View style={{ backgroundColor: "gray", gap: 5 }}>
            <Text style={{ fontSize: 20, fontWeight: "500" }}>
              {album.title}
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "400" }}>
              {album.assetCount}
            </Text>
          </View>
        ))}
      {/* </ScrollView> */}
      <ScrollView>
        {/* {albums &&
          albums.map((album, index) => (
            <AlbumEntry key={index} album={album} />
          ))} */}
      </ScrollView>
    </SafeAreaView>
  );
}

function AlbumEntry({ album }) {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    async function getAlbumAssets() {
      const albumAssets = await MediaLibrary.getAssetsAsync({ album });
      setAssets(albumAssets.assets);
    }
    getAlbumAssets();
  }, [album]);

  // console.log("assets---", assets);

  return (
    <View key={album.id} style={styles.albumContainer}>
      <Text>
        {album.title} - {album.assetCount ?? "no"} assets
      </Text>
      <View style={styles.albumAssetsContainer}>
        {/* {assets &&
          assets.map((asset, index) => (
            <Image
              key={index}
              source={{ uri: asset.uri }}
              width={asset.height/4}
              height={asset.width/4}
            />
          ))} */}
        {assets && (
          <FlatList
            data={assets}
            numColumns={3}
            contentContainerStyle={{ gap: 10 }}
            columnWrapperStyle={{ gap: 10 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              // console.log(item);
              return (
                <Image
                  source={{ uri: item.uri }}
                  width={"31%"}
                  height={100}
                  resizeMode="cover"
                  style={{ borderRadius: 20 }}
                />
              );
            }}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "",
    // alignItems: "center",
    // justifyContent: "center",
    marginHorizontal: 15,
  },
});
