import { useContext, useState } from "react";
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
import Modal from "react-native-modal";
import Colors from "../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import CategoryCard from "../components/CategoryCard";
import StudentNoticesSection from "../components/StudentNoticesSection";
import NavigationBar from "../components/NavigationBar";

const StudentDashboardScreen = () => {
  const { logout } = useContext(AuthContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { user } = useContext(AuthContext);

  const handleLogout = () => {
    setIsModalVisible(false);
    logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* App Bar Start */}
      <View style={styles.appBar}>
        <Text></Text>
        <Text style={styles.appBarText}>Dashboard</Text>
        <View>
          <TouchableOpacity
            onPress={() => setIsModalVisible(true)}
            style={styles.logOutContainer}
          >
            <Image
              source={require("../assets/images/Log out.png")}
              style={styles.logOut}
            ></Image>
          </TouchableOpacity>
        </View>

        {/* Logout confirmation modal */}
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => setIsModalVisible(false)}
        >
          <View style={styles.modal}>
            <Text style={styles.modalText}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setIsModalVisible(false)}
                color={Colors.primary}
              />
              <Button
                title="Logout"
                onPress={handleLogout}
                color={Colors.primary}
              />
            </View>
          </View>
        </Modal>
      </View>
      {/* App Bar End */}

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.greeting}>Welcome {user.name}!</Text>

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
            title="Culture"
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
  logOutContainer: {
    position: "absolute",
    right: 8,
    top: -15,
  },
  logOut: {
    resizeMode: "contain",
    height: 30,
    width: 30,
  },
  modal: { backgroundColor: "white", padding: 20, borderRadius: 10 },
  modalText: { marginBottom: 20, fontSize: 16, textAlign: "center" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  greeting: {
    fontFamily: "Inter-Light",
    fontSize: 22,
    marginTop: 15,
    marginLeft: 10,
    color: "black",
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
    color: "black",
  },
});
