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
  addDoc,
  deleteDoc,
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

// 📰 Get notices belonging to the user's subscribed groups (server-side filtering)
export const getUserNotices = async (userEmail) => {
  try {
    // 1) Find the user by email
    const usersRef = collection(db, "users");
    const qUser = query(usersRef, where("email", "==", userEmail));
    const userSnap = await getDocs(qUser);

    if (userSnap.empty) {
      console.warn("User not found:", userEmail);
      return [];
    }

    const userDoc = userSnap.docs[0];
    const { groupIDs = [] } = userDoc.data();

    if (!Array.isArray(groupIDs) || groupIDs.length === 0) {
      console.log("User is not subscribed to any groups.");
      return [];
    }

    // 2) Normalize to string IDs (support both string and DocumentReference)
    const normalizedIds = groupIDs
      .map((g) => {
        if (typeof g === "string") return g;
        if (g?.id) return g.id; // DocumentReference.id
        if (g?.path) return g.path.split("/").pop(); // fallback if path is present
        return null;
      })
      .filter(Boolean);

    if (normalizedIds.length === 0) return [];

    // 3) Firestore 'in' accepts up to 10 values -> chunk
    const chunks = [];
    for (let i = 0; i < normalizedIds.length; i += 10) {
      chunks.push(normalizedIds.slice(i, i + 10));
    }

    // 4) Query notices server-side for each chunk
    const all = [];
    for (const chunk of chunks) {
      const noticesRef = collection(db, "notices");
      const q = query(noticesRef, where("groupID", "in", chunk));
      const snap = await getDocs(q);
      snap.forEach((d) => all.push({ id: d.id, ...d.data() }));
    }

    // 5) (Optional) sort newest first by noticeSentDate, then eventDate
    all.sort((a, b) => {
      const toSec = (v) =>
        v?.seconds ??
        (isNaN(new Date(v).getTime()) ? 0 : new Date(v).getTime() / 1000);
      const aSent = toSec(a.noticeSentDate);
      const bSent = toSec(b.noticeSentDate);
      if (bSent !== aSent) return bSent - aSent;
      return (b.eventDate?.seconds ?? 0) - (a.eventDate?.seconds ?? 0);
    });

    return all;
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

// 🧑‍🏫 Get all groups a user manages
export const getManagedGroups = async (userEmail) => {
  try {
    // 1️⃣ Find the user by email
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", userEmail));
    const userSnap = await getDocs(q);

    if (userSnap.empty) {
      console.warn("User not found:", userEmail);
      return [];
    }

    const userDoc = userSnap.docs[0];
    const { managedGroupIDs = [] } = userDoc.data();

    if (managedGroupIDs.length === 0) {
      console.log("User manages no groups.");
      return [];
    }

    // 2️⃣ Fetch the group documents by ID
    const groupsRef = collection(db, "groups");
    const managedGroups = [];

    for (const groupId of managedGroupIDs) {
      const groupDocRef = doc(groupsRef, groupId);
      const groupSnap = await getDoc(groupDocRef);

      if (groupSnap.exists()) {
        managedGroups.push({ id: groupSnap.id, ...groupSnap.data() });
      }
    }

    return managedGroups;
  } catch (error) {
    console.error("Error fetching managed groups:", error);
    return [];
  }
};

// 🔍 Get a single subcategory by its ID
export const getSubCategoryById = async (subCategoryId) => {
  try {
    if (!subCategoryId) {
      console.warn("No subCategoryId provided");
      return null;
    }

    const subCatRef = doc(db, "subCategories", subCategoryId);
    const subCatSnap = await getDoc(subCatRef);

    if (!subCatSnap.exists()) {
      console.warn("Subcategory not found:", subCategoryId);
      return null;
    }

    return { id: subCatSnap.id, ...subCatSnap.data() };
  } catch (error) {
    console.error("Error fetching subcategory by ID:", error);
    return null;
  }
};

// 📢 Get all notices for a specific group
export const getNoticesByGroupId = async (groupId) => {
  try {
    if (!groupId) {
      console.warn("No groupId provided");
      return [];
    }

    const noticesRef = collection(db, "notices");
    const q = query(noticesRef, where("groupID", "==", groupId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log(`No notices found for group ID: ${groupId}`);
      return [];
    }

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching notices by group ID:", error);
    return [];
  }
};

// 📝 Create a new notice in the "notices" collection
export const createNotice = async ({
  title,
  subTitle,
  category,
  eventDate,
  groupID,
  notice,
}) => {
  try {
    // Firestore auto-converts JS Date objects into Timestamps
    const newNotice = {
      title,
      subTitle,
      category,
      eventDate,
      groupID,
      notice,
      noticeSentDate: new Date(), // current date/time
    };

    const docRef = await addDoc(collection(db, "notices"), newNotice);
    console.log("✅ Notice created with ID:", docRef.id);

    return { id: docRef.id, ...newNotice };
  } catch (error) {
    console.error("❌ Error creating notice:", error);
    throw error;
  }
};

// 🔁 Fully replace a notice (delete and recreate)
export const updateNotice = async (noticeId, updatedNotice) => {
  try {
    // 1️⃣ Delete the old notice
    await deleteDoc(doc(db, "notices", noticeId));
    console.log(`🗑️ Deleted old notice with ID: ${noticeId}`);

    // 2️⃣ Create the new notice
    const newNotice = {
      title: updatedNotice.title,
      subTitle: updatedNotice.subTitle,
      category: updatedNotice.category || "Academics",
      eventDate: updatedNotice.eventDate,
      groupID: updatedNotice.groupID,
      notice: updatedNotice.notice || "",
      noticeSentDate: new Date(),
    };

    const newDocRef = await addDoc(collection(db, "notices"), newNotice);
    console.log(`✅ Notice recreated with new ID: ${newDocRef.id}`);

    return { id: newDocRef.id, ...newNotice };
  } catch (error) {
    console.error("❌ Error updating notice:", error);
    throw error;
  }
};

// Fetch all notices for groups managed by a given userId, sorted by noticeSentDate (newest first)
export const getNoticesForManagedGroups = async (userId) => {
  try {
    if (!userId) {
      console.warn("getNoticesForManagedGroups: no userId provided");
      return [];
    }

    // 1) Get the user's managedGroupIDs
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      console.warn("User not found:", userId);
      return [];
    }

    const { managedGroupIDs = [] } = userSnap.data() || {};
    if (!Array.isArray(managedGroupIDs) || managedGroupIDs.length === 0) {
      // No managed groups; no notices
      return [];
    }

    // 2) Firestore 'in' queries support up to 10 values. Chunk if needed.
    const chunks = [];
    for (let i = 0; i < managedGroupIDs.length; i += 10) {
      chunks.push(managedGroupIDs.slice(i, i + 10));
    }

    const results = [];
    for (const idsChunk of chunks) {
      const noticesRef = collection(db, "notices");
      const q = query(noticesRef, where("groupID", "in", idsChunk));
      const snap = await getDocs(q);

      snap.forEach((d) => {
        results.push({ id: d.id, ...d.data() });
      });
    }

    // 3) Sort by noticeSentDate DESC (newest first). Handle Timestamp or Date/string.
    const toSeconds = (val) => {
      if (!val) return 0;
      if (typeof val?.toDate === "function")
        return val.toDate().getTime() / 1000;
      if (val?.seconds) return val.seconds; // Firestore Timestamp object
      const ms = new Date(val).getTime();
      return isNaN(ms) ? 0 : ms / 1000;
    };

    results.sort(
      (a, b) => toSeconds(b.noticeSentDate) - toSeconds(a.noticeSentDate)
    );

    return results;
  } catch (err) {
    console.error("Error in getNoticesForManagedGroups:", err);
    throw err;
  }
};
