import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constants/colors";
import ReturnToDashboardButton from "../components/ReturnToDashboardButton";
import { useNavigation } from "@react-navigation/native";

const ManageGroupScreen = ({ route }) => {
  const { title } = route.params;
  const navigation = useNavigation();

  const notices = [
    {
      id: 1,
      type: "sports",
      title: "Rugby",
      subHeading: "vs DF Malan",
      eventDate: "2025-10-05",
      noticeDate: "2025-10-03",
      notice: "Match may be moved indoors due to possible rain.",
    },
    {
      id: 2,
      type: "academics",
      title: "Math Quiz",
      subHeading: "Chapter 5 & 6",
      eventDate: "2025-10-07",
      noticeDate: "2025-10-02",
      notice: "Reminder: Bring calculators for the quiz.",
    },
  ];

  const handleNoticePress = (item) => {
    navigation.navigate("EditNotice", item);
  };

  const handleCreateNew = () => {
    navigation.navigate("CreateNewNotice", { groupTitle: title });
  };

  const renderNotice = ({ item }) => (
    <TouchableOpacity
      style={styles.noticeCard}
      onPress={() => handleNoticePress(item)}
    >
      <View>
        <Text style={styles.noticeTitle}>{item.title}</Text>
        <Text style={styles.noticeSub}>{item.subHeading}</Text>
        <Text style={styles.noticeDate}>Event Date: {item.eventDate}</Text>
      </View>
      <Text style={styles.editText}>Edit</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <Text></Text>
        <Text style={styles.appBarText}>{title}</Text>
        <Text></Text>
      </View>

      {/* Notices List */}
      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Notices Sent Out:</Text>
        <FlatList
          data={notices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNotice}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>

      {/* Create New Notice Button */}
      <TouchableOpacity style={styles.createButton} onPress={handleCreateNew}>
        <Text style={styles.createButtonText}>
          Create New Notice for {title}
        </Text>
      </TouchableOpacity>

      <ReturnToDashboardButton />
    </SafeAreaView>
  );
};

export default ManageGroupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  contentContainer: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Inter-Regular",
    marginBottom: 15,
    color: Colors.primary,
  },
  noticeCard: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
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
  createButton: {
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 15,
    marginTop: 10,
  },
  createButtonText: {
    color: "white",
    fontFamily: "Inter-Light",
    fontSize: 18,
  },
});
