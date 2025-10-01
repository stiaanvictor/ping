import { StyleSheet, View } from "react-native";
import StudentEventCard from "./StudentEventCard";

const events = [
  {
    id: 1,
    type: "sports",
    title: "Rugby",
    description: "vs DF Malan",
    date: "2025-10-05",
  },
  {
    id: 2,
    type: "academics",
    title: "Math Quiz",
    description: "Chapter 5 & 6",
    date: "2025-10-07",
  },
  {
    id: 3,
    type: "entertainment",
    title: "Movie Night",
    description: "Avengers: Endgame",
    date: "2025-10-08",
  },
  {
    id: 4,
    type: "clubs",
    title: "Chess Club",
    description: "Weekly Meetup",
    date: "2025-10-09",
  },
  {
    id: 5,
    type: "sports",
    title: "Soccer",
    description: "vs Greenfield HS",
    date: "2025-10-11",
  },
  {
    id: 6,
    type: "academics",
    title: "Science Fair",
    description: "Project submission",
    date: "2025-10-13",
  },
  {
    id: 7,
    type: "entertainment",
    title: "Concert",
    description: "Local Band Live",
    date: "2025-10-14",
  },
  {
    id: 8,
    type: "clubs",
    title: "Drama Club",
    description: "Rehearsal",
    date: "2025-10-15",
  },
];

function UpcomingEventsSection() {
  return (
    <View style={styles.container}>
      <View style={styles.events}>
        {events.map((event) => (
          <StudentEventCard
            key={event.id}
            type={event.type}
            title={event.title}
            description={event.description}
            date={event.date}
          />
        ))}
      </View>
    </View>
  );
}

export default UpcomingEventsSection;

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
  events: {
    backgroundColor: "white",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
