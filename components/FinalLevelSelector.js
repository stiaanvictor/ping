import { MaterialIcons } from "@expo/vector-icons";
import { useContext, useState } from "react";
import {
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../constants/colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import { AuthContext } from "../context/AuthContext";

const FinalLevelSelector = ({ title }) => {
  const [notifications, setNotifications] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { user } = useContext(AuthContext);

  const toggleNotifications = () => {
    setNotifications(!notifications);
  };

  const popupPress = () => setIsModalVisible(true);

  return (
    <View>
      <TouchableOpacity onPress={toggleNotifications} style={styles.container}>
        <Text style={styles.title}>{title}</Text>

        {user.sysAdmin ? (
          <TouchableOpacity onPress={popupPress}>
            <AntDesign name="more" size={24} color={Colors.primary} />
          </TouchableOpacity>
        ) : (
          ""
        )}

        <View>
          <MaterialIcons
            name={notifications ? "notifications-active" : "notifications-off"}
            size={24}
            color={Colors.primary}
          />
        </View>
      </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.editButton}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  // --- Modal styles ---
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
  modalText: {
    marginBottom: 20,
    fontSize: 16,
    textAlign: "center",
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
});

export default FinalLevelSelector;
