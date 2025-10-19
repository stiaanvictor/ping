import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Colors from "../constants/colors";
import { useNavigation } from "@react-navigation/native";
import { getSubCategoryById } from "../firebase/firebaseFunctions";

const TeacherGroupCard = ({ title, id, subCategoryID }) => {
  const navigation = useNavigation();
  const [subCategory, setSubCategory] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubcategory = async () => {
      const fetchedSubCategory = await getSubCategoryById(subCategoryID);
      setSubCategory(fetchedSubCategory);
      setLoading(false);
    };
    fetchSubcategory();
  }, []);

  const handlePress = () => {
    navigation.navigate("ManageGroup", { title, id });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Text style={styles.title}>
        {loading ? "" : subCategory.name}: {title}
      </Text>
      <Text style={styles.manage}>Click to Manage</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  manage: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.8,
  },
});

export default TeacherGroupCard;
