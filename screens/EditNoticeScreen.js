import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ReturnToDashboardButton from "../components/ReturnToDashboardButton";
import Colors from "../constants/colors";
import { EvilIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { updateNotice, deleteNotice } from "../firebase/firebaseFunctions";
import { useNavigation } from "@react-navigation/native";

function EditNoticeScreen({ route }) {
  const { item } = route.params;
  const navigation = useNavigation();

  const toJSDate = (val) => {
    if (!val) return new Date();
    if (typeof val?.toDate === "function") return val.toDate();
    if (typeof val === "string") return new Date(val);
    if (typeof val === "number") return new Date(val > 1e12 ? val : val * 1000);
    if (val?.seconds) return new Date(val.seconds * 1000);
    return new Date();
  };

  const eventDateTemp = toJSDate(item.eventDate);

  const [selectedDate, setSelectedDate] = useState(eventDateTemp);
  const [titleText, setTitleText] = useState(item.title || "");
  const [subHeadingText, setSubHeadingText] = useState(item.subTitle || "");
  const [noticeText, setNoticeText] = useState(item.notice || "");
  const [showCalendar, setShowCalendar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formattedEventDate, setFormattedEventDate] = useState(
    eventDateTemp.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  );

  const onChange = (event, picked) => {
    setShowCalendar(false);
    if (picked) {
      setSelectedDate(picked);
      setFormattedEventDate(
        picked.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );
    }
  };

  const handleUpdate = async () => {
    if (!titleText.trim() || !subHeadingText.trim() || !noticeText.trim()) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateNotice(item.id, {
        title: titleText.trim(),
        subTitle: subHeadingText.trim(),
        category: item.category || "Academics",
        eventDate: selectedDate,
        groupID: item.groupID,
        notice: noticeText.trim(),
      });

      Alert.alert("Success", "Notice updated successfully.", [
        { text: "OK", onPress: () => navigation.navigate("Dashboard") },
      ]);
    } catch (error) {
      console.error("Error updating notice:", error);
      Alert.alert("Error", "Failed to update notice. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this notice? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteNotice(item.id);
              Alert.alert("Deleted", "Notice deleted successfully.", [
                { text: "OK", onPress: () => navigation.navigate("Dashboard") },
              ]);
            } catch (error) {
              console.error("Error deleting notice:", error);
              Alert.alert("Error", "Failed to delete notice.");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* App Bar Start */}
      <View style={styles.appBar}>
        <Text></Text>
        <Text style={styles.appBarText}>Edit Notice</Text>
        <Text></Text>
      </View>
      {/* App Bar End */}

      <View style={styles.editingContainer}>
        <Text style={styles.fieldTitle}>Title:</Text>
        <TextInput
          value={titleText}
          onChangeText={setTitleText}
          style={styles.input}
        />

        <Text style={styles.fieldTitle}>Subheading:</Text>
        <TextInput
          value={subHeadingText}
          onChangeText={setSubHeadingText}
          style={styles.input}
        />

        <Text style={styles.fieldTitle}>Date:</Text>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{formattedEventDate}</Text>
          <TouchableOpacity onPress={() => setShowCalendar(true)}>
            <EvilIcons name="pencil" size={32} color="black" />
          </TouchableOpacity>
        </View>

        {showCalendar && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChange}
          />
        )}

        <Text style={styles.fieldTitle}>Notice:</Text>
        <TextInput
          value={noticeText}
          onChangeText={setNoticeText}
          style={styles.input}
          placeholder="e.g. Event moved indoors..."
          multiline={true}
        />

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && { opacity: 0.6 }]}
          onPress={handleUpdate}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? "Updating..." : "Update And Send Out Notice"}
          </Text>
        </TouchableOpacity>

        {/* 🗑️ Delete Notice Button */}
        <TouchableOpacity
          style={[styles.deleteButton, isSubmitting && { opacity: 0.6 }]}
          onPress={handleDelete}
          disabled={isSubmitting}
        >
          <Text style={styles.deleteButtonText}>Delete Notice</Text>
        </TouchableOpacity>
      </View>

      <ReturnToDashboardButton />
    </SafeAreaView>
  );
}

export default EditNoticeScreen;

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
  editingContainer: {
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
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  date: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
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
  deleteButton: {
    backgroundColor: "#dc3545",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 15,
  },
  deleteButtonText: {
    color: "white",
    fontFamily: "Inter-Light",
    fontSize: 18,
  },
});
