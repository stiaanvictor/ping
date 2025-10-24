import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import { getAllUsers, updateUserType } from "../firebase/firebaseFunctions";
import Colors from "../constants/colors";
import StudentNavigationBar from "../components/StudentNavigationBar";

function ManageUsersScreen() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    const lower = text.toLowerCase();
    const filtered = users.filter((u) => u.email.toLowerCase().includes(lower));
    setFilteredUsers(filtered);
  };

  const handleChangeType = async (userId, newType) => {
    try {
      await updateUserType(userId, newType);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, userType: newType } : u))
      );
      setFilteredUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, userType: newType } : u))
      );
    } catch (error) {
      console.error("Error updating user type:", error);
    }
  };

  const renderUser = ({ item }) => (
    <View style={styles.userCard}>
      <Text style={styles.email}>{item.email}</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={item.userType || "student"}
          style={styles.picker}
          dropdownIconColor={Colors.primary}
          onValueChange={(value) => handleChangeType(item.id, value)}
        >
          <Picker.Item label="Student" value="student" />
          <Picker.Item label="Teacher" value="teacher" />
          <Picker.Item label="Admin" value="admin" />
        </Picker>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Users</Text>
      <TextInput
        style={styles.search}
        placeholder="Search users by email..."
        value={search}
        onChangeText={handleSearch}
      />

      {filteredUsers.length > 0 ? (
        <FlatList
          data={filteredUsers}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      ) : (
        <Text style={styles.noUsers}>No users found.</Text>
      )}
      <StudentNavigationBar />
    </View>
  );
}

export default ManageUsersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter-Regular",
    marginBottom: 15,
    color: Colors.primary,
    textAlign: "center",
  },
  search: {
    backgroundColor: "#F3F3F3",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    color: "black",
    fontFamily: "Inter-Regular",
  },
  userCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  email: {
    fontSize: 16,
    color: "#333",
    fontFamily: "Inter-Regular",
    marginBottom: 8,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
    height: 50,
    justifyContent: "center",
  },

  picker: {
    width: "100%",
    color: "#000",
    marginTop: Platform.OS === "android" ? -3 : 0,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noUsers: {
    textAlign: "center",
    color: "gray",
    marginTop: 20,
    fontFamily: "Inter-Regular",
  },
});
