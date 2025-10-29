import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constants/colors";
import ReturnToDashboardButton from "../components/ReturnToDashboardButton";
import { useNavigation } from "@react-navigation/native";
import { getNoticesByGroupId } from "../firebase/firebaseFunctions";

const ManageGroupScreen = ({ route }) => {
  const { title, id, category } = route.params;
  const navigation = useNavigation();

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const fetchedNotices = await getNoticesByGroupId(id);
        setNotices(fetchedNotices);
      } catch (error) {
        console.error("Error fetching notices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [id]);

  const handleNoticePress = (item) => {
    navigation.navigate("EditNotice", { item });
  };

  const handleCreateNew = () => {
    navigation.navigate("CreateNewNotice", {
      groupTitle: title,
      groupId: id,
      category: category,
    });
  };

  const renderNotice = (item) => {
    const eventDate = item.eventDate?.seconds
      ? new Date(item.eventDate.seconds * 1000).toLocaleDateString()
      : String(item.eventDate || "N/A");

    return (
      <TouchableOpacity
        key={item.id || item.title}
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
      {/* App Bar */}
      <View style={styles.appBar}>
        <Text></Text>
        <Text style={styles.appBarText}>{title}</Text>
        <Text></Text>
      </View>

      {/* Notices List */}
      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Notices Sent Out:</Text>

        <View style={styles.noticeListBox}>
          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : notices.length > 0 ? (
            <ScrollView
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={true}
            >
              {notices.map((item) => renderNotice(item))}
            </ScrollView>
          ) : (
            <Text style={styles.noNoticesText}>No notices found.</Text>
          )}
        </View>
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
    marginBottom: 10,
    color: Colors.primary,
  },
  noticeListBox: {
    height: 400,
    borderRadius: 10,
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
