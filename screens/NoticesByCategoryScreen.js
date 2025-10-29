import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constants/colors";
import ReturnToDashboardButton from "../components/ReturnToDashboardButton";
import { getNoticesByCategory } from "../firebase/firebaseFunctions";
import { useEffect, useState } from "react";
import StudentNoticeCard from "../components/StudentNoticeCard";

function NoticesByCategoryScreen({ route }) {
  const { category } = route.params;
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (timestamp) => {
    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000).toISOString().split("T")[0];
    }
    return timestamp || "";
  };

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await getNoticesByCategory(category);
        setNotices(data);
      } catch (error) {
        console.error("Error fetching notices by category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [category]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBar}>
        <Text></Text>
        <Text style={styles.appBarText}>{category} Notices</Text>
        <Text></Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {notices.length > 0 ? (
          notices.map((item) => (
            <StudentNoticeCard
              key={item.id}
              type={item.category}
              title={item.title}
              subHeading={item.subTitle}
              eventDate={formatDate(item.eventDate)}
              noticeDate={formatDate(item.noticeSentDate)}
              notice={item.notice}
            />
          ))
        ) : (
          <Text style={styles.noNotices}>No notices found.</Text>
        )}
      </ScrollView>

      <ReturnToDashboardButton />
    </SafeAreaView>
  );
}

export default NoticesByCategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
  content: {
    padding: 20,
  },
  noNotices: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 40,
    color: "#555",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
