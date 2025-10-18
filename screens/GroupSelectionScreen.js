import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavigationBar from "../components/NavigationBar";
import Colors from "../constants/colors";
import TopLevelSelector from "../components/TopLevelSelector";
import SubLevelSelector from "../components/SubLevelSelector";
import { useEffect, useState } from "react";
import { getSubCategories } from "../firebase/firebaseFunctions";

function GroupSelectionScreen() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState({
    Sports: [],
    Academics: [],
    Culture: [],
    Clubs: [],
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [sports, academics, culture, clubs] = await Promise.all([
          getSubCategories("Sports"),
          getSubCategories("Academics"),
          getSubCategories("Culture"),
          getSubCategories("Clubs"),
        ]);

        setCategories({
          Sports: sports,
          Academics: academics,
          Culture: culture,
          Clubs: clubs,
        });
      } catch (error) {
        console.error("Error loading group data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

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
        {/* Sports */}
        <TopLevelSelector title="Sports">
          {categories.Sports.length > 0 ? (
            categories.Sports.map((sub) => (
              <SubLevelSelector
                key={sub.id}
                title={sub.name}
                subCategoryId={sub.id}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No sports groups found.</Text>
          )}
        </TopLevelSelector>

        <TopLevelSelector title="Academics">
          {categories.Academics.length > 0 ? (
            categories.Academics.map((sub) => (
              <SubLevelSelector
                key={sub.id}
                title={sub.name}
                subCategoryId={sub.id}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No academic groups found.</Text>
          )}
        </TopLevelSelector>

        <TopLevelSelector title="Culture">
          {categories.Culture.length > 0 ? (
            categories.Culture.map((sub) => (
              <SubLevelSelector
                key={sub.id}
                title={sub.name}
                subCategoryId={sub.id}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No culture groups found.</Text>
          )}
        </TopLevelSelector>

        <TopLevelSelector title="Clubs">
          {categories.Clubs.length > 0 ? (
            categories.Clubs.map((sub) => (
              <SubLevelSelector
                key={sub.id}
                title={sub.name}
                subCategoryId={sub.id}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No clubs found.</Text>
          )}
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
  emptyText: {
    marginLeft: 20,
    marginTop: 10,
    color: "#555",
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
