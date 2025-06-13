import type { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { ID, ImageGravity, type Models } from "appwrite";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { Query } from "appwrite";

export const createUserAccount = async (user: INewUser) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );
    if (!newAccount) throw Error;

    const avatarURL = avatars.getInitials(user.name);
    /**Avatars is an appwrite service that takes a string (in this case, the user's full name like "Mohamed Badr"),
     * extracts the initials (e.g., "MB"), and generates a URL to an image that shows those initials. */

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      imageUrl: avatarURL,
      username: user.username,
    });

    return newUser;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const saveUserToDB = async (user: {
  accountId: string;
  name: string;
  email: string;
  imageUrl: string;
  username?: string;
}) => {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );
    // console.log(newUser);
    return newUser;
  } catch (error) {
    console.error(error);
  }
};

export const signInAccount = async (user: {
  email: string;
  password: string;
}) => {
  try {
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );
    // console.log(session);
    return session;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error("User not found");
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser || currentUser.documents.length === 0)
      throw Error("User not found");
    return currentUser.documents[0];
  } catch (error) {
    console.error(error);
  }
};

export const signOutAccount = async () => {
  try {
    const session = await account.deleteSession("current");
    if (!session) throw Error("Failed to sign out");
    return session;
  } catch (error) {
    console.log(error);
  }
};

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

export function getFilePreview(fileId: string) {
  const appwriteCloudStatus = import.meta.env.VITE_APPWRITE_CLOUD_STATUS;
  //if it is true then we are using appwrite cloud, and we can't use getFilePreview,
  //but if it is false then we are using appwrite locally, and we can use getFilePreview

  try {
    const fileUrl =
      appwriteCloudStatus === "true"
        ? storage.getFileView(
            appwriteConfig.storageId,
            fileId
          )
        : // getFilePreview is used to set the preview of the file{width, height, gravity, quality} ,and this feature is not supported in appwrite cloud free version,
          // but it can be used in appwrite locally
          storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000, //width
            2000, //height
            ImageGravity.Top, //gravity
            100 //quality
          );
    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}
export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}
export const createPost = async (post: INewPost) => {
  try {
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);
    if (!uploadedFile) throw Error;

    // Get file url
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
};

export const getRecentPosts = async () => {
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId, // databaseId
    appwriteConfig.postCollectionId, // collectionId
    [Query.orderDesc("$createdAt"), Query.limit(20)] // queries (optional)
  );

  if (!posts) throw Error;

  return posts;
};

export const likePost = async (postId: string, likesArray: string[]) => {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId, // databaseId
      appwriteConfig.postCollectionId, // collectionId
      postId, // documentId
      { likes: likesArray } // data
    );
    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
};

export const savePost = async (postId: string, userId: string) => {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId, // databaseId
      appwriteConfig.saveCollectionId, // collectionId
      ID.unique(), // documentId
      { post: postId, user: userId } // data
    );
    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
};

export const deleteSavedPost = async (savedRecordId: string) => {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId, // databaseId
      appwriteConfig.saveCollectionId, // collectionId
      savedRecordId // documentId
    );
    if (!statusCode) throw Error;

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
};

export const getPostById = async (postId: string) => {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId, // databaseId
      appwriteConfig.postCollectionId, // collectionId
      postId // documentId
    );
    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = async (post: IUpdatePost) => {
  const hasFileToUpdate = post.file.length > 0;
  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };
    if (hasFileToUpdate) {
      // Upload file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;

      // Get file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    if (!updatedPost) {
      await deleteFile(post.imageId);
      throw Error;
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (postId: string, imageId: string) => {
  if (!postId || !imageId) throw Error;

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId, // databaseId
      appwriteConfig.postCollectionId, // collectionId
      postId // documentId
    );
    if (!statusCode) throw Error;

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
};

export async function getInfinitePosts({ pageParam }: { pageParam?: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString())); //cursorAfter is used to get the next page
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export const getSavedPosts = async (userId: string) => {
  try {
    const saves = await databases.listDocuments(
      appwriteConfig.databaseId, // databaseId
      appwriteConfig.saveCollectionId, // collectionId,
      [Query.equal("user", userId)] // queries
    );
    if (!saves) throw Error;
    return saves;
  } catch (error) {
    console.log(error);
  }
};

export const getAllUsers = async (currentUserId: string) => {
  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId, // databaseId
      appwriteConfig.userCollectionId, // collectionId,
      [
        Query.orderAsc("$createdAt"), // order by createdAt ascending
        Query.notEqual("$id", currentUserId), // exclude current user by their custom "id" field
      ]
    );
    if (!users) throw Error;
    return users;
  } catch (error) {
    console.log(error);
  }
};

export const getUserById = async (userId: string) => {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId, // databaseId
      appwriteConfig.userCollectionId, // collectionId,
      userId // queries
    );
    if (!user) throw Error;
    return user;
  } catch (error) {
    console.log(error);
  }
};



export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    //  Update user
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}