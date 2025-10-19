import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import NavigationBar from "../components/NavigationBar";
import { SafeAreaView } from "react-native-safe-area-context";
import TeacherGroupCard from "../components/TeacherGroupCard";
import { AuthContext } from "../context/AuthContext";
import { getManagedGroups } from "../firebase/firebaseFunctions";

function TeacherGroupsScreen() {
  const { user } = useContext(AuthContext);
  const [managedGroups, setManagedGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      if (user?.email) {
        const groups = await getManagedGroups(user.email);
        setManagedGroups(groups);
      }
    };
    fetchGroups();
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Managed Groups:</Text>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {managedGroups.length > 0 ? (
          managedGroups.map((group) => (
            <TeacherGroupCard
              key={group.id}
              title={group.name}
              id={group.id}
              subCategoryID={group.subCategoryID}
            />
          ))
        ) : (
          <Text style={styles.noGroups}>You are not managing any groups.</Text>
        )}
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
  noGroups: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "gray",
    textAlign: "center",
    marginTop: 40,
  },
});
