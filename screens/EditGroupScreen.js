import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import Colors from "../constants/colors";
import { Checkbox } from "react-native-paper";
import ReturnToGroupsButton from "../components/ReturnToGroupsButton";

function EditGroupScreen({ route }) {
  const { group } = route.params; // expects { group: { title: '...', admins: [...] } }

  const [titleText, setTitleText] = useState(group?.title || "");
  const [modalVisible, setModalVisible] = useState(false);

  const [users, setUsers] = useState(
    group?.admins || [
      { id: "1", name: "John Smith", hasPermission: true },
      { id: "2", name: "Mary Jones", hasPermission: false },
      { id: "3", name: "Alex Brown", hasPermission: true },
      { id: "4", name: "Sarah Johnson", hasPermission: false },
      { id: "5", name: "Michael Davis", hasPermission: false },
      { id: "6", name: "Emily Wilson", hasPermission: false },
      { id: "7", name: "David Anderson", hasPermission: true },
      { id: "8", name: "Jessica Martinez", hasPermission: false },
      { id: "9", name: "Chris Taylor", hasPermission: false },
      { id: "10", name: "Amanda Thomas", hasPermission: false },
      { id: "11", name: "Daniel White", hasPermission: false },
      { id: "12", name: "Laura Harris", hasPermission: false },
      { id: "13", name: "Matthew Clark", hasPermission: false },
      { id: "14", name: "Olivia Lewis", hasPermission: false },
      { id: "15", name: "James Walker", hasPermission: false },
      { id: "16", name: "Sophia Hall", hasPermission: true },
      { id: "17", name: "Ethan Allen", hasPermission: false },
      { id: "18", name: "Grace Young", hasPermission: false },
      { id: "19", name: "Benjamin King", hasPermission: true },
      { id: "20", name: "Chloe Wright", hasPermission: false },
    ]
  );

  const togglePermission = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, hasPermission: !u.hasPermission } : u
      )
    );
  };

  const handleSave = () => {
    // your save logic here
    console.log("Saved group changes:", { titleText, users });
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

        <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
          <Text style={styles.submitButtonText}>Save Changes</Text>
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
                  <Text style={styles.userName}>{item.name}</Text>
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
