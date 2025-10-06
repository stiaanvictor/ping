import { useContext } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import Colors from "../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import CategoryCard from "../components/CategoryCard";
import StudentNoticesSection from "../components/StudentNoticesSection";
import NavigationBar from "../components/NavigationBar";

const StudentDashboardScreen = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* App Bar Start */}
      <View style={styles.appBar}>
        <Text></Text>
        <Text style={styles.appBarText}>Dashboard</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Image
            source={require("../assets/images/Log out.png")}
            style={styles.logOut}
          ></Image>
        </TouchableOpacity>
      </View>
      {/* App Bar End */}

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.greeting}>Welcome John Doe!</Text>

        {/* 4 Categories Start */}
        <View style={styles.categoriesContainer}>
          <CategoryCard
            title="Academics"
            imageSource={require("../assets/images/academics.png")}
          />
          <CategoryCard
            title="Sports"
            imageSource={require("../assets/images/sports.png")}
          />
          <CategoryCard
            title="Entertainment"
            imageSource={require("../assets/images/entertainment.png")}
          />
          <CategoryCard
            title="Clubs"
            imageSource={require("../assets/images/clubs.png")}
          />
        </View>
        {/* 4 Categories End */}

        {/* Upcoming events Start */}
        <Text style={styles.upcomingEventsTitle}>Newest Notices:</Text>
        <StudentNoticesSection />
        {/* Upcoming events End */}
      </ScrollView>
      <NavigationBar />
    </SafeAreaView>
  );
};

export default StudentDashboardScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EFEFEF" },
  appBar: {
    flexDirection: "row",
    justifyContent: "space-between", // pushes items to the edges
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  appBarText: {
    fontSize: 30,
    color: "white",
    fontFamily: "Inter-Light",
    fontWeight: 500,
  },
  logOut: {
    position: "absolute",
    right: 8,
    top: -15,
    resizeMode: "contain",
    height: 30,
    width: 30,
  },
  greeting: {
    fontFamily: "Inter-Light",
    fontSize: 22,
    marginTop: 15,
    marginLeft: 10,
    color: Colors.primary,
  },
  categoriesContainer: {
    marginTop: 15,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  upcomingEventsTitle: {
    fontFamily: "Inter-Light",
    fontSize: 20,
    marginTop: 15,
    marginLeft: 20,
    color: Colors.primary,
  },
});
