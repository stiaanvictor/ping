import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import Modal from "react-native-modal";
import Colors from "../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import CategoryCard from "../components/CategoryCard";
import NavigationBar from "../components/NavigationBar";
import { getNoticesForManagedGroups } from "../firebase/firebaseFunctions";
import { useNavigation } from "@react-navigation/native";

function TeacherDashboardScreen() {
  const { user, logout } = useContext(AuthContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const handleLogout = () => {
    setIsModalVisible(false);
    logout();
  };

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        if (!user?.userId) return;
        const fetched = await getNoticesForManagedGroups(user.userId);
        setNotices(fetched);
      } catch (err) {
        console.error("Error fetching teacher notices:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, [user?.userId]);

  const handleNoticePress = (item) => {
    navigation.navigate("EditNotice", { item });
  };

  const renderNotice = ({ item }) => {
    const eventDate = item.eventDate?.seconds
      ? new Date(item.eventDate.seconds * 1000).toLocaleDateString()
      : String(item.eventDate || "N/A");

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.noticeCard}
        onPress={() => handleNoticePress(item)}
      >
        <View>
          <Text style={styles.noticeTitle}>{item.title}</Text>
          <Text style={styles.noticeSub}>{item.subTitle}</Text>
          <Text style={styles.noticeDate}>Event Date: {eventDate}</Text>
        </View>
        <Text style={styles.editText}>Edit</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ✅ App Bar */}
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
            />
          </TouchableOpacity>
        </View>

        {/* Logout Modal */}
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

      {/* ✅ Main Layout */}
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.greeting}>
              Welcome {user?.name || "Teacher"}!
            </Text>

            {/* Categories */}
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

            {/* ✅ Notices Section (same as ManageGroupScreen) */}
            <Text style={styles.sectionTitle}>Your Sent Notices:</Text>
            <View style={styles.noticeListBox}>
              {loading ? (
                <Text style={styles.loadingText}>Loading...</Text>
              ) : notices.length > 0 ? (
                <ScrollView
                  contentContainerStyle={{ paddingBottom: 20 }}
                  showsVerticalScrollIndicator={true}
                >
                  {notices.map((item) => renderNotice({ item }))}
                </ScrollView>
              ) : (
                <Text style={styles.noNoticesText}>No notices found.</Text>
              )}
            </View>
          </>
        }
        data={[]} // header-only layout
        renderItem={null}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <NavigationBar />
    </SafeAreaView>
  );
}

export default TeacherDashboardScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EFEFEF" },

  appBar: {
    flexDirection: "row",
    justifyContent: "space-between",
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

  // ✅ Matches ManageGroupScreen styles
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Inter-Regular",
    marginTop: 20,
    marginLeft: 20,
    color: Colors.primary,
  },
  noticeListBox: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 15,
    padding: 10,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "gray",
    textAlign: "center",
    marginVertical: 20,
  },
  noNoticesText: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "gray",
    textAlign: "center",
    marginVertical: 20,
  },
  noticeCard: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noticeTitle: {
    color: "white",
    fontSize: 18,
    fontFamily: "Inter-Regular",
  },
  noticeSub: {
    color: "white",
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 3,
  },
  noticeDate: {
    color: "#e0e0e0",
    fontSize: 12,
  },
  editText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
