import { Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Colors from "../constants/colors";

function StudentNoticeCard({
  id,
  type,
  title,
  subHeading,
  eventDate,
  noticeDate,
  notice,
}) {
  const navigation = useNavigation();

  const images = {
    Sports: require("../assets/images/sports.png"),
    Academics: require("../assets/images/academics.png"),
    Culture: require("../assets/images/entertainment.png"),
    Clubs: require("../assets/images/clubs.png"),
  };

  const handlePress = () => {
    navigation.navigate("ViewNotice", {
      id,
      type,
      title,
      subHeading,
      eventDate,
      noticeDate,
      notice,
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.container}>
        <View style={styles.left}>
          <Image source={images[type]} style={styles.image} />
        </View>
        <View style={styles.middle}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{subHeading}</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.date}>{eventDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default StudentNoticeCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    borderRadius: 15,
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginBottom: 20,
  },
  left: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 75,
  },
  image: {
    resizeMode: "contain",
    width: 75,
    height: 75,
  },
  middle: {
    flex: 1,
    marginLeft: 20,
  },
  title: {
    color: "white",
    fontFamily: "Inter-Regular",
    fontSize: 26,
  },
  description: { color: "white", fontSize: 16, fontFamily: "Inter-Light" },
  right: {},
  date: { color: "white", position: "absolute", bottom: -10, right: 5 },
});
