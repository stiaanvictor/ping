import { ScrollView, StyleSheet, Text, View } from "react-native";
import NavigationBar from "../components/NavigationBar";
import { SafeAreaView } from "react-native-safe-area-context";
import TeacherGroupCard from "../components/TeacherGroupCard";

function TeacherGroupsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Managed Groups: </Text>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <TeacherGroupCard title="Rugby u14 A" />
        <TeacherGroupCard title="History Grade 9" />
        <TeacherGroupCard title="Math Grade 10" />
        <TeacherGroupCard title="Science Grade 8" />
        <TeacherGroupCard title="English Grade 11" />
      </ScrollView>

      <NavigationBar />
    </SafeAreaView>
  );
}

export default TeacherGroupsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter-Light",
    marginTop: 20,
    marginBottom: 10,
  },
});
