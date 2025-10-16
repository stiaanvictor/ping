import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ReturnToDashboardButton from "../components/ReturnToDashboardButton";
import { useState } from "react";
import Colors from "../constants/colors";
import { EvilIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

function CreateNewNoticeScreen({ route }) {
  const { groupTitle } = route.params;
  const [titleText, setTitleText] = useState("");
  const [subHeadingText, setSubHeadingText] = useState("");
  const [noticeText, setNoticeText] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formattedEventDate = selectedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const onChange = (event, selected) => {
    setShowCalendar(false);
    if (selected) setSelectedDate(selected);
  };

  const handleCreate = () => {
    console.log("Created new notice for", groupTitle);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <Text></Text>
        <Text style={styles.appBarText}>Create New Notice</Text>
        <Text></Text>
      </View>

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

        <TouchableOpacity style={styles.submitButton} onPress={handleCreate}>
          <Text style={styles.submitButtonText}>Create and Send Notice</Text>
        </TouchableOpacity>
      </View>

      <ReturnToDashboardButton />
    </SafeAreaView>
  );
}

export default CreateNewNoticeScreen;

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
});
