import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import Colors from "../constants/colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import FinalLevelSelector from "./FinalLevelSelector";
import {
  getGroupsBySubCategory,
  deleteSubCategoryAndGroups,
} from "../firebase/firebaseFunctions";

const SubLevelSelector = ({ title, subCategoryId }) => {
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const { user } = useContext(AuthContext);

  const onPressHandle = async () => {
    setOpen(!open);
    if (!open && groups.length === 0) {
      setLoading(true);
      const fetchedGroups = await getGroupsBySubCategory(subCategoryId);
      setGroups(fetchedGroups);
      setLoading(false);
    }
  };

  const addGroupPressed = () => {
    setIsModalVisible(false);
    navigation.navigate("AddGroup", { title, subCategoryId });
  };

  const editGroupPressed = () => {
    setIsModalVisible(false);
    navigation.navigate("EditCategory", { group: { title, subCategoryId } });
  };

  const popupPress = () => setIsModalVisible(true);

  const handleDeletePress = () => {
    setIsModalVisible(false);
    setConfirmDeleteVisible(true);
  };

  const confirmDelete = async () => {
    setConfirmDeleteVisible(false);
    try {
      await deleteSubCategoryAndGroups(subCategoryId);
      Alert.alert(
        "Deleted",
        `${title} and its groups were deleted successfully.`
      );
      console.log(`Deleted subCategory ${subCategoryId} and all groups.`);
    } catch (error) {
      console.error("Delete failed:", error);
      Alert.alert("Error", "Failed to delete category and its groups.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.titleContainer}
        activeOpacity={1}
        onPress={onPressHandle}
      >
        <Text style={styles.title}>{title}</Text>

        {user.userType == "admin" ? (
          <TouchableOpacity onPress={popupPress}>
            <AntDesign name="more" size={24} color="white" />
          </TouchableOpacity>
        ) : null}

        <Image
          style={styles.arrow}
          source={
            open
              ? require("../assets/images/arrow_down_white.png")
              : require("../assets/images/arrow_right_white.png")
          }
        />
      </TouchableOpacity>

      {open && (
        <View style={styles.childrenContainer}>
          {loading ? (
            <Text style={{ color: "#888", marginLeft: 10 }}>
              Loading groups...
            </Text>
          ) : groups.length > 0 ? (
            groups.map((group) => (
              <FinalLevelSelector
                key={group.id}
                title={group.name}
                groupId={group.id}
              />
            ))
          ) : (
            <Text style={{ color: "#888", marginLeft: 10 }}>
              No groups found.
            </Text>
          )}
        </View>
      )}

      {/* Admin options popup */}
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
                    style={styles.addButton}
                    onPress={addGroupPressed}
                  >
                    <Text style={styles.buttonText}>Add Group</Text>
                  </TouchableOpacity>

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

      {/* Confirm delete modal */}
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
                  Are you sure you want to delete this category?{"\n"}
                  All groups inside will be permanently deleted.
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
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    backgroundColor: "#5A688F",
    paddingHorizontal: 15,
    marginBottom: 1,
    borderRadius: 10,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontFamily: "Inter-Light",
  },
  arrow: {
    resizeMode: "contain",
    height: 40,
    width: 40,
  },
  childrenContainer: {
    marginLeft: 15,
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
  addButton: {
    backgroundColor: Colors.primary,
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 10,
    paddingVertical: 5,
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

export default SubLevelSelector;
