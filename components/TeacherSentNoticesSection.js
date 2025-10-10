import { StyleSheet, View } from "react-native";
import StudentNoticeCard from "./StudentNoticeCard";
import TeacherNoticeCard from "./TeacherNoticeCard";

const data = [
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

function TeacherSentNoticesSection({ date }) {
  // Filter notices if a date is provided
  const displayedNotices = date
    ? data.filter((notice) => notice.eventDate === date)
    : data;

  return (
    <View style={styles.container}>
      <View style={styles.notices}>
        {displayedNotices.length > 0 ? (
          displayedNotices.map((item) => (
            <TeacherNoticeCard
              key={item.id}
              type={item.type}
              title={item.title}
              subHeading={item.subHeading}
              eventDate={item.eventDate}
              noticeDate={item.noticeDate}
              notice={item.notice}
            />
          ))
        ) : (
          <Text>No notices for this date.</Text>
        )}
      </View>
    </View>
  );
}

export default TeacherSentNoticesSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8, // for Android shadow
  },
  notices: {
    backgroundColor: "white",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
