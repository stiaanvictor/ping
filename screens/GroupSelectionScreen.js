import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavigationBar from "../components/NavigationBar";
import Colors from "../constants/colors";
import TopLevelSelector from "../components/TopLevelSelector";
import SubLevelSelector from "../components/SubLevelSelector";
import FinalLevelSelector from "../components/FinalLevelSelector";

function GroupSelectionScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* App Bar Start */}
      <View style={styles.appBar}>
        <Text></Text>
        <Text style={styles.appBarText}>Groups</Text>
        <Text></Text>
      </View>
      {/* App Bar End */}

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 100,
          paddingHorizontal: 10,
        }}
      >
        <TopLevelSelector title="Sports">
          <SubLevelSelector title="Rugby">
            <FinalLevelSelector title="u14 A Team" />
            <FinalLevelSelector title="u14 B Team" />
            <FinalLevelSelector title="u15 A Team" />
            <FinalLevelSelector title="u15 B Team" />
          </SubLevelSelector>
          <SubLevelSelector title="Cricket"></SubLevelSelector>
          <SubLevelSelector title="Soccer"></SubLevelSelector>
        </TopLevelSelector>

        <TopLevelSelector title="Academics">
          <SubLevelSelector title="Math">
            <FinalLevelSelector title="Grade 8" />
            <FinalLevelSelector title="Grade 9" />
            <FinalLevelSelector title="Grade 10" />
            <FinalLevelSelector title="Grade 11" />
            <FinalLevelSelector title="Grade 12" />
          </SubLevelSelector>
          <SubLevelSelector title="History">
            <FinalLevelSelector title="Grade 8" />
            <FinalLevelSelector title="Grade 9" />
            <FinalLevelSelector title="Grade 10" />
            <FinalLevelSelector title="Grade 11" />
            <FinalLevelSelector title="Grade 12" />
          </SubLevelSelector>
          <SubLevelSelector title="English">
            <FinalLevelSelector title="Grade 8" />
            <FinalLevelSelector title="Grade 9" />
            <FinalLevelSelector title="Grade 10" />
            <FinalLevelSelector title="Grade 11" />
            <FinalLevelSelector title="Grade 12" />
          </SubLevelSelector>
        </TopLevelSelector>

        <TopLevelSelector title="Culture"></TopLevelSelector>

        <TopLevelSelector title="Clubs"></TopLevelSelector>
      </ScrollView>
      <NavigationBar />
    </SafeAreaView>
  );
}

export default GroupSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEFEF",
  },
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
});
