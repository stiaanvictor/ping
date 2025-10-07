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
          marginTop: 20,
          paddingHorizontal: 10,
        }}
      >
        <TopLevelSelector title="Sports">
          <SubLevelSelector title="Rugby">
            <SubLevelSelector title="u14">
              <FinalLevelSelector title="A Team" />
              <FinalLevelSelector title="B Team" />
              <FinalLevelSelector title="C Team" />
              <FinalLevelSelector title="D Team" />
            </SubLevelSelector>
            <SubLevelSelector title="u15"></SubLevelSelector>
            <SubLevelSelector title="u16"></SubLevelSelector>
          </SubLevelSelector>
          <SubLevelSelector title="Cricket">
            <SubLevelSelector title="u14"></SubLevelSelector>
            <SubLevelSelector title="u15"></SubLevelSelector>
            <SubLevelSelector title="u16"></SubLevelSelector>
          </SubLevelSelector>
          <SubLevelSelector title="Soccer">
            <SubLevelSelector title="u14"></SubLevelSelector>
            <SubLevelSelector title="u15"></SubLevelSelector>
            <SubLevelSelector title="u16"></SubLevelSelector>
          </SubLevelSelector>
        </TopLevelSelector>

        <TopLevelSelector title="Academics">
          <SubLevelSelector title="Math">
            <SubLevelSelector title="Grade 8"></SubLevelSelector>
            <SubLevelSelector title="Grade 9"></SubLevelSelector>
            <SubLevelSelector title="Grade 10"></SubLevelSelector>
            <SubLevelSelector title="Grade 11"></SubLevelSelector>
            <SubLevelSelector title="Grade 12"></SubLevelSelector>
          </SubLevelSelector>
          <SubLevelSelector title="History">
            <SubLevelSelector title="Grade 8"></SubLevelSelector>
            <SubLevelSelector title="Grade 9"></SubLevelSelector>
            <SubLevelSelector title="Grade 10"></SubLevelSelector>
            <SubLevelSelector title="Grade 11"></SubLevelSelector>
            <SubLevelSelector title="Grade 12"></SubLevelSelector>
          </SubLevelSelector>
          <SubLevelSelector title="English">
            <SubLevelSelector title="Grade 8"></SubLevelSelector>
            <SubLevelSelector title="Grade 9"></SubLevelSelector>
            <SubLevelSelector title="Grade 10"></SubLevelSelector>
            <SubLevelSelector title="Grade 11"></SubLevelSelector>
            <SubLevelSelector title="Grade 12"></SubLevelSelector>
          </SubLevelSelector>
        </TopLevelSelector>
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
