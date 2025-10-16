import { MaterialIcons } from "@expo/vector-icons";
import { useContext, useState } from "react";
import {
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
} from "react-native";
import Colors from "../constants/colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const FinalLevelSelector = ({ title }) => {
  const navigation = useNavigation();

  const [notifications, setNotifications] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const { user } = useContext(AuthContext);

  const toggleNotifications = () => {
    setNotifications(!notifications);
  };

  const popupPress = () => setIsModalVisible(true);

  const handleDeletePress = () => {
    setIsModalVisible(false);
    setConfirmDeleteVisible(true);
  };

  const confirmDelete = () => {
    setConfirmDeleteVisible(false);
    // Your delete logic here
    console.log("Final-level item deleted");
  };

  const editGroupPressed = () => {
    navigation.navigate("EditGroup", { group: { title } });
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleNotifications} style={styles.container}>
        <Text style={styles.title}>{title}</Text>

        {user.sysAdmin ? (
          <TouchableOpacity onPress={popupPress}>
            <AntDesign name="more" size={24} color={Colors.primary} />
          </TouchableOpacity>
        ) : null}

        <View>
          <MaterialIcons
            name={notifications ? "notifications-active" : "notifications-off"}
            size={24}
            color={Colors.primary}
          />
        </View>
      </TouchableOpacity>

      {/* Main options popup */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={editGroupPressed}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDeletePress}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Confirm Delete Popup */}
      <Modal
        visible={confirmDeleteVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setConfirmDeleteVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => setConfirmDeleteVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.confirmBox}>
                <Text style={styles.confirmTitle}>Confirm Deletion</Text>
                <Text style={styles.confirmText}>
                  Are you sure you want to delete this item?
                </Text>

                <View style={styles.confirmButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setConfirmDeleteVisible(false)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={confirmDelete}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    backgroundColor: "white",
    paddingHorizontal: 15,
    marginTop: 2,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter-Light",
    color: Colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalButtons: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  editButton: {
    backgroundColor: Colors.primary,
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 10,
    paddingVertical: 5,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 10,
    paddingVertical: 5,
  },
  buttonText: {
    color: "white",
    fontFamily: "Inter-Regular",
    fontSize: 18,
  },
  confirmBox: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 10,
    width: "80%",
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 10,
  },
  confirmText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  confirmButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    flex: 1,
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 10,
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: "#dc3545",
    flex: 1,
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 10,
    marginLeft: 10,
  },
});

export default FinalLevelSelector;
