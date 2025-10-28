import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import StudentNoticeCard from "./StudentNoticeCard";
import { getUserNotices } from "../firebase/firebaseFunctions";
import { AuthContext } from "../context/AuthContext";

function StudentNoticesSection({ date }) {
  const { user } = useContext(AuthContext);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserNotices = async () => {
      try {
        if (!user?.userId) return;
        const data = await getUserNotices();

        setNotices(data);
      } catch (error) {
        console.error("Error fetching user notices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserNotices();
  }, [user]);

  // Format Firestore Timestamps to YYYY-MM-DD
  const formatDate = (timestamp) => {
    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000).toISOString().split("T")[0];
    }
    return timestamp || "";
  };

  // Filter notices if a specific date is passed
  const displayedNotices = date
    ? notices.filter((notice) => formatDate(notice.eventDate) === date)
    : notices;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.notices}>
        {displayedNotices.length > 0 ? (
          displayedNotices.map((item) => (
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
          <Text>No notices</Text>
        )}
      </View>
    </View>
  );
}

export default StudentNoticesSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  notices: {
    backgroundColor: "white",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
