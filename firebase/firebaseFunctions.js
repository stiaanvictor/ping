import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db } from "./firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

// 🔐 Login
export const firebaseLogin = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

// 📰 Get notices belonging to the user's subscribed groups
export const getUserNotices = async (userEmail) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", userEmail));
    const userSnap = await getDocs(q);

    if (userSnap.empty) {
      console.warn("User not found:", userEmail);
      return [];
    }

    const userDoc = userSnap.docs[0];
    const { groupIDs = [] } = userDoc.data();

    if (groupIDs.length === 0) {
      console.log("User is not subscribed to any groups.");
      return [];
    }

    const noticesRef = collection(db, "notices");
    const noticesSnap = await getDocs(noticesRef);

    const userNotices = noticesSnap.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((notice) =>
        groupIDs.some((groupRef) => groupRef.path === notice.groupID?.path)
      );

    return userNotices;
  } catch (error) {
    console.error("Error fetching user notices:", error);
    return [];
  }
};

// 🗂 Get all notices by category
export const getNoticesByCategory = async (categoryName) => {
  try {
    const noticesRef = collection(db, "notices");
    const q = query(noticesRef, where("category", "==", categoryName));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching notices by category:", error);
    return [];
  }
};

// ✅ CORRECTED BELOW — these now match your Firestore structure

// 📚 Get subcategories under a given category (e.g. "Rugby", "Cricket" under "Sports")
export const getSubCategories = async (categoryName) => {
  try {
    const subCatRef = collection(db, "subCategories");
    const q = query(subCatRef, where("category", "==", categoryName));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return [];

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return [];
  }
};

// 🏈 Get groups under a given subcategory (e.g. "U14 A", "U15 B")
export const getGroupsBySubCategory = async (subCategoryId) => {
  try {
    if (!subCategoryId) {
      console.warn("No subCategoryId provided");
      return [];
    }

    const groupsRef = collection(db, "groups");
    const q = query(groupsRef, where("subCategoryID", "==", subCategoryId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log(`No groups found for subcategory ID: ${subCategoryId}`);
      return [];
    }

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name || doc.id,
    }));
  } catch (error) {
    console.error("Error fetching groups by subcategory:", error);
    return [];
  }
};

// ➕ Subscribe user to a group (stores only groupId string)
export const subscribeToGroup = async (userEmail, groupId) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", userEmail));
    const userSnap = await getDocs(q);

    if (userSnap.empty) {
      console.warn("User not found:", userEmail);
      return;
    }

    const userDocRef = doc(db, "users", userSnap.docs[0].id);

    // Add plain string ID to array
    await updateDoc(userDocRef, {
      groupIDs: arrayUnion(groupId),
    });

    console.log(`✅ Subscribed to group: ${groupId}`);
  } catch (error) {
    console.error("Error subscribing to group:", error);
  }
};

// ➖ Unsubscribe user from a group (removes groupId string)
export const unsubscribeFromGroup = async (userEmail, groupId) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", userEmail));
    const userSnap = await getDocs(q);

    if (userSnap.empty) {
      console.warn("User not found:", userEmail);
      return;
    }

    const userDocRef = doc(db, "users", userSnap.docs[0].id);

    // Remove plain string ID from array
    await updateDoc(userDocRef, {
      groupIDs: arrayRemove(groupId),
    });

    console.log(`🚫 Unsubscribed from group: ${groupId}`);
  } catch (error) {
    console.error("Error unsubscribing from group:", error);
  }
};
