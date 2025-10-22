import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import Colors from "../constants/colors";
import ReturnToGroupsButton from "../components/ReturnToGroupsButton";
import { updateSubCategoryName } from "../firebase/firebaseFunctions";

function EditCategoryScreen({ route }) {
  const { group } = route.params; // expects { group: { title: '...' }, subCategoryId }

  const [titleText, setTitleText] = useState(group?.title || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!titleText.trim()) {
      Alert.alert("Error", "Please enter a valid title.");
      return;
    }

    try {
      setSaving(true);
      await updateSubCategoryName(group.subCategoryId, titleText.trim());
      Alert.alert("Success", "Category updated successfully!");
      console.log("Saved changes to category:", titleText);
    } catch (error) {
      console.error("Failed to update category:", error);
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
        <Text style={styles.appBarText}>Edit Category</Text>
        <Text></Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.editingTitle}>Editing {group?.title}</Text>

        <Text style={styles.fieldTitle}>Title:</Text>
        <TextInput
          value={titleText}
          onChangeText={setTitleText}
          style={styles.input}
          editable={!saving}
        />

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
    </SafeAreaView>
  );
}

export default EditCategoryScreen;

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
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
    fontFamily: "Inter-Light",
    fontSize: 18,
  },
});
