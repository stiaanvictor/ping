import { StyleSheet, View } from "react-native";
import StudentNoticeCard from "./StudentNoticeCard";

const notices = [
  {
    id: 1,
    type: "sports",
    title: "Rugby",
    description: "vs DF Malan",
    eventDate: "2025-10-05",
    noticeDate: "2025-10-03",
    notice: "Match may be moved indoors due to possible rain.",
  },
  {
    id: 2,
    type: "academics",
    title: "Math Quiz",
    description: "Chapter 5 & 6",
    eventDate: "2025-10-07",
    noticeDate: "2025-10-02",
    notice: "Reminder: Bring calculators for the quiz.",
  },
  {
    id: 3,
    type: "entertainment",
    title: "Movie Night",
    description: "Avengers: Endgame",
    eventDate: "2025-10-08",
    noticeDate: "2025-10-05",
    notice: "Snacks will be sold at the entrance.",
  },
  {
    id: 4,
    type: "clubs",
    title: "Chess Club",
    description: "Weekly Meetup",
    eventDate: "2025-10-09",
    noticeDate: "2025-10-06",
    notice: "Special guest player attending this week.",
  },
  {
    id: 5,
    type: "sports",
    title: "Soccer",
    description: "vs Greenfield HS",
    eventDate: "2025-10-11",
    noticeDate: "2025-10-08",
    notice: "Kickoff time moved to 4 PM.",
  },
  {
    id: 6,
    type: "academics",
    title: "Science Fair",
    description: "Project submission",
    eventDate: "2025-10-13",
    noticeDate: "2025-10-09",
    notice: "Deadline extended by one day.",
  },
  {
    id: 7,
    type: "entertainment",
    title: "Concert",
    description: "Local Band Live",
    eventDate: "2025-10-14",
    noticeDate: "2025-10-10",
    notice: "Venue changed to school auditorium.",
  },
  {
    id: 8,
    type: "clubs",
    title: "Drama Club",
    description: "Rehearsal",
    eventDate: "2025-10-15",
    noticeDate: "2025-10-12",
    notice: "Rehearsal extended by 30 minutes.",
  },
];

function StudentNoticesSection({ date }) {
  // Filter notices if a date is provided
  const displayedNotices = date
    ? notices.filter((notice) => notice.eventDate === date)
    : notices;

  return (
    <View style={styles.container}>
      <View style={styles.notices}>
        {displayedNotices.length > 0 ? (
          displayedNotices.map((notice) => (
            <StudentNoticeCard
              key={notice.id}
              type={notice.type}
              title={notice.title}
              description={notice.description}
              eventDate={notice.eventDate}
              noticeDate={notice.noticeDate}
              notice={notice.notice}
            />
          ))
        ) : (
          <Text>No notices for this date.</Text>
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
    elevation: 8, // for Android shadow
  },
  notices: {
    backgroundColor: "white",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
