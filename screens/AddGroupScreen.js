import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import Colors from "../constants/colors";
import { Checkbox } from "react-native-paper";
import ReturnToGroupsButton from "../components/ReturnToGroupsButton";
import {
  fetchTeachers,
  addGroup,
  addGroupToUser,
} from "../firebase/firebaseFunctions";

function AddGroupScreen({ route }) {
  const { title, subCategoryId } = route.params;
  const [titleText, setTitleText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch only teachers
  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const fetchedTeachers = await fetchTeachers();
        setTeachers(fetchedTeachers);
      } catch (err) {
        console.error("Error loading teachers:", err);
      } finally {
        setLoading(false);
      }
    };
    loadTeachers();
  }, []);

  const togglePermission = (id) => {
    setTeachers((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, hasPermission: !t.hasPermission } : t
      )
    );
  };

  const handleAddGroup = async () => {
    if (!titleText.trim()) {
      Alert.alert("Error", "Please enter a group name.");
      return;
    }

    try {
      // 1. Add group to Firestore
      const newGroupId = await addGroup(titleText.trim(), subCategoryId);

      // 2. Add this group to selected teachers’ managedGroupIDs
      const selectedTeachers = teachers.filter((t) => t.hasPermission);
      for (const teacher of selectedTeachers) {
        await addGroupToUser(teacher.email, newGroupId);
      }

      Alert.alert("Success", "Group added successfully!");
      setTitleText("");
    } catch (error) {
      console.error("Error adding group:", error);
      Alert.alert("Error", "Failed to add group.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <Text></Text>
        <Text style={styles.appBarText}>Add Group</Text>
        <Text></Text>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        <Text style={styles.fieldTitle}>Title:</Text>
        <TextInput
          value={titleText}
          onChangeText={setTitleText}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.addAdminButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addAdminButtonText}>Manage Admins</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleAddGroup}>
          <Text style={styles.submitButtonText}>Add Group to {title}</Text>
        </TouchableOpacity>
      </View>

      <ReturnToGroupsButton />

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Manage Teacher Permissions</Text>

            {loading ? (
              <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
              <FlatList
                data={teachers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.userRow}
                    onPress={() => togglePermission(item.id)}
                  >
                    <Text style={styles.userName}>{item.email}</Text>
                    <Checkbox
                      status={item.hasPermission ? "checked" : "unchecked"}
                      onPress={() => togglePermission(item.id)}
                    />
                  </TouchableOpacity>
                )}
              />
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default AddGroupScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  formContainer: {
    backgroundColor: "white",
    marginHorizontal: 20,
    paddingHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    paddingVertical: 20,
  },
  fieldTitle: {
    fontSize: 18,
    fontFamily: "Inter-Light",
  },
  input: {
    backgroundColor: "white",
    color: "black",
    borderRadius: 8,
    padding: 10,
    paddingBottom: 5,
    marginBottom: 25,
    width: 300,
    fontSize: 16,
    fontFamily: "Inter-Regular",
    borderBottomWidth: 1,
    borderColor: "#e4e4e4ff",
    marginTop: -5,
  },
  addAdminButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  addAdminButtonText: {
    color: "white",
    fontFamily: "Inter-Light",
    fontSize: 18,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 50,
  },
  submitButtonText: {
    color: "white",
    fontFamily: "Inter-Light",
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  userName: {
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 15,
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
  },
});
