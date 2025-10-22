import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import Colors from "../constants/colors";
import { Checkbox } from "react-native-paper";
import ReturnToGroupsButton from "../components/ReturnToGroupsButton";
import {
  getTeachersWithGroupPermission,
  updateGroupName,
  updateGroupAdmins,
} from "../firebase/firebaseFunctions";

function EditGroupScreen({ route }) {
  const { group } = route.params; // expects { group: { id, title, subCategoryId } }

  const [titleText, setTitleText] = useState(group?.title || "");
  const [modalVisible, setModalVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [saving, setSaving] = useState(false);

  // Fetch teachers and mark which ones have permission
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await getTeachersWithGroupPermission(group.id);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error loading teachers:", error);
        Alert.alert("Error", "Failed to load teachers.");
      }
    };
    loadUsers();
  }, [group.id]);

  const togglePermission = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, hasPermission: !u.hasPermission } : u
      )
    );
  };

  const handleSave = async () => {
    if (!titleText.trim()) {
      Alert.alert("Error", "Please enter a valid group name.");
      return;
    }

    try {
      setSaving(true);
      await updateGroupName(group.id, titleText.trim());
      await updateGroupAdmins(group.id, users);
      Alert.alert("Success", "Group updated successfully!");
      console.log("Saved group changes:", { titleText, users });
    } catch (error) {
      console.error("Failed to update group:", error);
      Alert.alert("Error", "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <Text></Text>
        <Text style={styles.appBarText}>Edit Group</Text>
        <Text></Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.editingTitle}>Editing {group?.title}</Text>

        <Text style={styles.fieldTitle}>Group Name:</Text>
        <TextInput
          value={titleText}
          onChangeText={setTitleText}
          style={styles.input}
          editable={!saving}
        />

        <TouchableOpacity
          style={styles.addAdminButton}
          onPress={() => setModalVisible(true)}
          disabled={saving}
        >
          <Text style={styles.addAdminButtonText}>Manage Admins</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.submitButtonText}>
            {saving ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </View>

      <ReturnToGroupsButton />

      {/* Modal for managing admins */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Manage Admin Permissions</Text>

            <FlatList
              data={users}
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

export default EditGroupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  formContainer: {
    backgroundColor: "white",
    marginHorizontal: 20,
    paddingHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    paddingVertical: 20,
  },
  editingTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 20,
    fontFamily: "Inter-Regular",
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
