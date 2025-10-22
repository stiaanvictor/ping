import { MaterialIcons } from "@expo/vector-icons";
import { useContext, useEffect, useState, useCallback } from "react";
import {
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import Colors from "../constants/colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import {
  subscribeToGroup,
  unsubscribeFromGroup,
  deleteGroup,
} from "../firebase/firebaseFunctions";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";

const FinalLevelSelector = ({ title, groupId }) => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [subscribed, setSubscribed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

  const userEmail = auth.currentUser?.email;

  const checkSubscription = useCallback(async () => {
    try {
      if (!userEmail || !groupId) return;

      const usersRef = collection(db, "users");
      const qUsers = query(usersRef, where("email", "==", userEmail));
      const snap = await getDocs(qUsers);

      if (snap.empty) {
        setSubscribed(false);
        return;
      }

      const data = snap.docs[0].data();
      const groupIDs = data.groupIDs || [];

      const isSub = groupIDs.some((g) => {
        if (typeof g === "string") return g === groupId;
        if (g?.id) return g.id === groupId;
        if (g?.path) return g.path.endsWith(`/${groupId}`);
        return false;
      });

      setSubscribed(isSub);
    } catch (e) {
      console.error("Error checking subscription:", e);
      setSubscribed(false);
    }
  }, [userEmail, groupId]);

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  const toggleSubscription = async () => {
    try {
      if (!userEmail) return;

      if (subscribed) {
        await unsubscribeFromGroup(userEmail, groupId);
      } else {
        await subscribeToGroup(userEmail, groupId);
      }

      await checkSubscription();
    } catch (error) {
      console.error("Error toggling subscription:", error);
    }
  };

  const popupPress = () => setIsModalVisible(true);

  const handleDeletePress = () => {
    setIsModalVisible(false);
    setConfirmDeleteVisible(true);
  };

  const confirmDelete = async () => {
    setConfirmDeleteVisible(false);
    try {
      await deleteGroup(groupId);
      Alert.alert("Success", `Group "${title}" has been deleted.`);
    } catch (error) {
      console.error("Error deleting group:", error);
      Alert.alert("Error", "Failed to delete group.");
    }
  };

  const editGroupPressed = () => {
    navigation.navigate("EditGroup", { group: { title, id: groupId } });
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleSubscription} style={styles.container}>
        <Text style={styles.title}>{title}</Text>

        {user.userType === "admin" ? (
          <TouchableOpacity onPress={popupPress}>
            <AntDesign name="more" size={24} color={Colors.primary} />
          </TouchableOpacity>
        ) : null}

        <MaterialIcons
          name={subscribed ? "notifications-active" : "notifications-off"}
          size={24}
          color={Colors.primary}
        />
      </TouchableOpacity>

      {/* Admin popup */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View className="modalButtons">
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

      {/* Confirm Delete */}
      <Modal
        visible={confirmDeleteVisible}
        transparent
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
                  Are you sure you want to delete this group?
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
