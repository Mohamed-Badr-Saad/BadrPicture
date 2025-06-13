import type { Models } from "appwrite";
import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-queries/queriesAndMutations";
import React, { useEffect, useState } from "react";
import { checkIsLiked } from "@/lib/utils";
import { Loader } from "lucide-react";

type PostStatsProps = {
  post: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const likesList: string[] = post?.likes.map(
    (user: Models.Document) => user.$id
  );
  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isDeletingSaved } =
    useDeleteSavedPost();
  const { data: currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post?.$id === post?.$id
  );

  useEffect(() => {
    setIsSaved(!!savedPostRecord); //!!savedPostRecord returns true or false
  }, [currentUser]);

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    let newLikesList = [...likes];

    if (likes.includes(userId)) {
      /*if the user liked this post before*/ newLikesList = newLikesList.filter(
        (id) => id !== userId
      );
    } else {
      newLikesList.push(userId);
    }
    setLikes(newLikesList);
    likePost({ postId: post.$id, likesArray: newLikesList });
  };

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (savedPostRecord) {
      /*if the user saved this post before*/ setIsSaved(false);
      deleteSavedPost({ savedRecordId: savedPostRecord.$id });
    } else {
      setIsSaved(true);
      savePost({ postId: post.$id, userId: userId });
    }
  };
  return (
    <div className="flex flex-row justify-between z-20 items-center">
      <div className="flex gap-2 mr-5">
        <img
          src={
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }
          alt="like"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={(e) => {
            handleLikePost(e);
          }}
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>
      <div className="flex gap-2">
        {isDeletingSaved || isSavingPost ? (
          <Loader />
        ) : (
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="like"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={(e) => {
              handleSavePost(e);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PostStats;
