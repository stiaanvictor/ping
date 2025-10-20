import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../constants/colors";
import { useState } from "react";
import ReturnToGroupsButton from "../components/ReturnToGroupsButton";
import { addSubCategory } from "../firebase/firebaseFunctions";

function AddCategoryScreen({ route }) {
  const { title } = route.params;
  const [titleText, setTitleText] = useState("");

  const handleAdd = async () => {
    if (!titleText.trim()) {
      Alert.alert("Error", "Please enter a sub-category name.");
      return;
    }

    try {
      await addSubCategory(titleText.trim(), title);
      Alert.alert("Success", `Sub-category added to ${title}`);
      setTitleText("");
    } catch (error) {
      Alert.alert("Error", "Failed to add sub-category.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <Text></Text>
        <Text style={styles.appBarText}>Add Sub-Category</Text>
        <Text></Text>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        <Text style={styles.fieldTitle}>Title:</Text>
        <TextInput
          value={titleText}
          onChangeText={setTitleText}
          style={styles.input}
          placeholder="Enter sub-category name"
          placeholderTextColor="#aaa"
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleAdd}>
          <Text style={styles.submitButtonText}>Add Category to {title}</Text>
        </TouchableOpacity>
      </View>

      <ReturnToGroupsButton />
    </SafeAreaView>
  );
}

export default AddCategoryScreen;

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
    fontWeight: "500",
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
    marginBottom: 25,
    width: 300,
    fontSize: 16,
    fontFamily: "Inter-Regular",
    borderBottomWidth: 1,
    borderColor: "#e4e4e4ff",
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  submitButtonText: {
    color: "white",
    fontFamily: "Inter-Light",
    fontSize: 18,
  },
});
