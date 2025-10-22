import { auth } from "./firebaseConfig";
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
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
  setDoc,
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

export const firebaseSignup = async (email, password) => {
  const auth = getAuth();

  // 1️⃣ Create Firebase Auth user
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  // 2️⃣ Create Firestore user doc
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    email: email,
    userType: "student",
    groupIDs: [],
  });

  // 3️⃣ Wait until the user doc is actually written
  let attempts = 0;
  while (attempts < 5) {
    // ~5 attempts max
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) break;
    await new Promise((resolve) => setTimeout(resolve, 500)); // wait 0.5 sec
    attempts++;
  }

  return user;
};

export const firebaseResetPassword = async (email) => {
  const auth = getAuth();
  await sendPasswordResetEmail(auth, email);
};

// 📰 Get notices belonging to the user's subscribed groups (server-side filtering)
export const getUserNotices = async (userEmail) => {
  try {
    // 1️⃣ Find user by email
    const usersRef = collection(db, "users");
    const qUser = query(usersRef, where("email", "==", userEmail));
    const userSnap = await getDocs(qUser);

    // ✅ If no user doc yet (likely just signed up), stop early
    if (userSnap.empty) {
      console.log("User doc not found yet. Probably just signed up.");
      return [];
    }

    const userDoc = userSnap.docs[0];
    const data = userDoc.data();

    // ✅ Stop if groupIDs missing or empty
    if (!data || !Array.isArray(data.groupIDs) || data.groupIDs.length === 0) {
      console.log("User has no valid groupIDs yet — skipping notices fetch.");
      return [];
    }

    // 2️⃣ Normalize IDs
    const normalizedIds = data.groupIDs
      .map((g) => {
        if (typeof g === "string") return g;
        if (g?.id) return g.id;
        if (g?.path) return g.path.split("/").pop();
        return null;
      })
      .filter(Boolean);

    if (normalizedIds.length === 0) return [];

    // 3️⃣ Chunk for Firestore 'in' query
    const chunks = [];
    for (let i = 0; i < normalizedIds.length; i += 10) {
      chunks.push(normalizedIds.slice(i, i + 10));
    }

    const all = [];

    // ✅ Wrap in try/catch to silence harmless “invalid data” race errors
    try {
      for (const chunk of chunks) {
        if (!chunk || chunk.length === 0) continue;
        const noticesRef = collection(db, "notices");
        const q = query(noticesRef, where("groupID", "in", chunk));
        const snap = await getDocs(q);
        snap.forEach((d) => all.push({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      if (err.message.includes("Function where() called with invalid data")) {
        console.log("Skipped invalid query — user doc not ready yet.");
        return [];
      } else {
        throw err;
      }
    }

    // 4️⃣ Sort newest first
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

    const groups = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name || doc.id,
    }));

    // Sort alphabetically and numerically (natural sort)
    groups.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: "base",
      })
    );

    return groups;
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

export async function addSubCategory(name, category) {
  if (!name || !category) {
    throw new Error("Both name and category are required.");
  }

  try {
    const docRef = await addDoc(collection(db, "subCategories"), {
      name: name,
      category: category,
    });
    console.log("Sub-category added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding sub-category:", error);
    throw error;
  }
}

export async function fetchTeachers() {
  try {
    const q = query(
      collection(db, "users"),
      where("userType", "==", "teacher")
    );
    const querySnapshot = await getDocs(q);

    const teachers = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      teachers.push({
        id: doc.id,
        email: data.email || "Unknown",
        hasPermission: false,
      });
    });

    return teachers;
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
}

/**
 * Add a new group to Firestore.
 * @param {string} name - Group name.
 * @param {string} subCategoryId - The ID of the parent subcategory.
 * @returns {Promise<string>} - The new group document ID.
 */
export async function addGroup(name, subCategoryId) {
  if (!name || !subCategoryId)
    throw new Error("Missing group name or subCategoryId.");

  try {
    const docRef = await addDoc(collection(db, "groups"), {
      name: name,
      subCategoryID: subCategoryId,
    });
    console.log("Group added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding group:", error);
    throw error;
  }
}

/**
 * Add a group ID to a user's managedGroupIDs array (using their email).
 * @param {string} userEmail - The user's email.
 * @param {string} groupId - The group ID to add.
 */
export async function addGroupToUser(userEmail, groupId) {
  if (!userEmail || !groupId) throw new Error("Missing userEmail or groupId.");

  try {
    const usersRef = collection(db, "users");
    const userQuery = query(usersRef, where("email", "==", userEmail));
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty) {
      console.error("No user found with email:", userEmail);
      return;
    }

    const userDoc = querySnapshot.docs[0];
    const userDocRef = doc(db, "users", userDoc.id);

    await updateDoc(userDocRef, {
      managedGroupIDs: arrayUnion(groupId),
    });

    console.log(`Group ${groupId} added to user ${userEmail}`);
  } catch (error) {
    console.error("Error adding group to user:", error);
    throw error;
  }
}

/**
 * Deletes all groups linked to a specific subCategory.
 * @param {string} subCategoryId - The ID of the subCategory to delete groups for.
 */
export async function deleteGroupsBySubCategory(subCategoryId) {
  if (!subCategoryId) throw new Error("Missing subCategoryId.");

  try {
    const groupsRef = collection(db, "groups");
    const q = query(groupsRef, where("subCategoryID", "==", subCategoryId));
    const querySnapshot = await getDocs(q);

    const deletePromises = querySnapshot.docs.map((docSnap) =>
      deleteDoc(doc(db, "groups", docSnap.id))
    );

    await Promise.all(deletePromises);
    console.log(
      `Deleted ${querySnapshot.size} group(s) under subCategory ${subCategoryId}`
    );
  } catch (error) {
    console.error("Error deleting groups:", error);
    throw error;
  }
}

/**
 * Deletes a subCategory and all groups linked to it.
 * @param {string} subCategoryId - The ID of the subCategory to delete.
 */
export async function deleteSubCategoryAndGroups(subCategoryId) {
  if (!subCategoryId) throw new Error("Missing subCategoryId.");

  try {
    // 1. Delete all groups belonging to the subCategory
    await deleteGroupsBySubCategory(subCategoryId);

    // 2. Delete the subCategory document itself
    await deleteDoc(doc(db, "subCategories", subCategoryId));

    console.log(
      `SubCategory ${subCategoryId} and its groups deleted successfully.`
    );
  } catch (error) {
    console.error("Error deleting subCategory and groups:", error);
    throw error;
  }
}

/**
 * Updates the name of a subcategory in Firestore.
 * @param {string} subCategoryId - The document ID of the subcategory.
 * @param {string} newName - The new name for the subcategory.
 */
export async function updateSubCategoryName(subCategoryId, newName) {
  if (!subCategoryId || !newName) {
    throw new Error("Missing subCategoryId or newName.");
  }

  try {
    const subCategoryRef = doc(db, "subCategories", subCategoryId);
    await updateDoc(subCategoryRef, { name: newName });
    console.log(
      `Subcategory ${subCategoryId} updated successfully to "${newName}"`
    );
  } catch (error) {
    console.error("Error updating subcategory name:", error);
    throw error;
  }
}

/**
 * Fetches all teachers and marks which have this group assigned in their managedGroupIDs.
 * @param {string} groupId - The ID of the group.
 * @returns {Promise<Array>} Array of teachers with { id, email, hasPermission }.
 */
export async function getTeachersWithGroupPermission(groupId) {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("userType", "==", "teacher"));
    const querySnapshot = await getDocs(q);

    const users = querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      const hasPermission =
        Array.isArray(data.managedGroupIDs) &&
        data.managedGroupIDs.includes(groupId);
      return {
        id: docSnap.id,
        email: data.email || "Unknown",
        hasPermission,
      };
    });

    return users;
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
}

/**
 * Updates the name of a group.
 * @param {string} groupId - The document ID of the group.
 * @param {string} newName - The new name for the group.
 */
export async function updateGroupName(groupId, newName) {
  if (!groupId || !newName) throw new Error("Missing groupId or newName.");

  try {
    const groupRef = doc(db, "groups", groupId);
    await updateDoc(groupRef, { name: newName });
    console.log(`Group ${groupId} renamed to "${newName}"`);
  } catch (error) {
    console.error("Error updating group name:", error);
    throw error;
  }
}

/**
 * Updates which users manage a group (adds/removes groupId in managedGroupIDs).
 * @param {string} groupId - The group ID.
 * @param {Array} updatedUsers - Array of user objects with { id, hasPermission }.
 */
export async function updateGroupAdmins(groupId, updatedUsers) {
  try {
    const updates = updatedUsers.map(async (user) => {
      const userRef = doc(db, "users", user.id);
      if (user.hasPermission) {
        await updateDoc(userRef, {
          managedGroupIDs: arrayUnion(groupId),
        });
      } else {
        await updateDoc(userRef, {
          managedGroupIDs: arrayRemove(groupId),
        });
      }
    });

    await Promise.all(updates);
    console.log("Admin permissions updated for group:", groupId);
  } catch (error) {
    console.error("Error updating group admins:", error);
    throw error;
  }
}

/**
 * Deletes a group and removes its ID from all users' managedGroupIDs and groupIDs arrays.
 * @param {string} groupId - The ID of the group to delete.
 */
export async function deleteGroup(groupId) {
  try {
    if (!groupId) throw new Error("Group ID is required");

    // Remove this groupId from all users’ arrays
    const usersRef = collection(db, "users");
    const usersSnap = await getDocs(usersRef);

    const userUpdates = usersSnap.docs.map(async (userDoc) => {
      const userRef = doc(db, "users", userDoc.id);
      await updateDoc(userRef, {
        managedGroupIDs: arrayRemove(groupId),
        groupIDs: arrayRemove(groupId),
      });
    });

    await Promise.all(userUpdates);

    // Delete the group document itself
    const groupRef = doc(db, "groups", groupId);
    await deleteDoc(groupRef);

    console.log(`Group ${groupId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting group:", error);
    throw error;
  }
}

/**
 * Deletes a notice from Firestore by its ID.
 * @param {string} noticeId - The document ID of the notice to delete.
 */
export async function deleteNotice(noticeId) {
  try {
    if (!noticeId) throw new Error("Notice ID is required");
    const noticeRef = doc(db, "notices", noticeId);
    await deleteDoc(noticeRef);
    console.log(`Notice ${noticeId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting notice:", error);
    throw error;
  }
}

// 🔹 Get all users from Firestore
export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    const users = [];
    snapshot.forEach((docSnap) => {
      users.push({ id: docSnap.id, ...docSnap.data() });
    });
    return users;
  } catch (error) {
    console.error("Error getting all users:", error);
    return [];
  }
};

export const updateUserType = async (userId, newType) => {
  try {
    const userRef = doc(db, "users", userId);

    // Get current user data
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      console.error(`User ${userId} not found.`);
      return;
    }

    // Base update data
    const updateData = { userType: newType };

    // If user becomes a teacher, ensure managedGroupIDs array exists
    if (newType === "teacher") {
      const userData = userSnap.data();
      if (!Array.isArray(userData.managedGroupIDs)) {
        updateData.managedGroupIDs = [];
      }
    }

    await updateDoc(userRef, updateData);
    console.log(`✅ Updated user ${userId} to ${newType}`);
  } catch (error) {
    console.error("Error updating user type:", error);
    throw error;
  }
};
