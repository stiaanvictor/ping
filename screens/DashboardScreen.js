import { Text } from "react-native";
import StudentDashboardScreen from "./StudentDashboardScreen";
import TeacherDashboardScreen from "./TeacherDashboardScreen";

function DashboardScreen() {
  const userType = "teacher";

  if (userType === "student") {
    return <StudentDashboardScreen />;
  } else if (userType === "teacher") {
    return <TeacherDashboardScreen />;
  } else {
    return <Text>Screen not found</Text>;
  }
}

export default DashboardScreen;
