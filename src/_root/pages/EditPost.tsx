import PostForm from "@/components/forms/PostForm";
import Loader from "@/components/shared/Loader";
import { useGetPostById } from "@/lib/react-queries/queriesAndMutations";
import { useParams } from "react-router-dom";

const EditPost = () => {
  const { id } = useParams();
  const { data: post, isPending: isPostLoading } = useGetPostById(id || "");

  if (isPostLoading) return <Loader />;
  
  return (
    <div className="flex flex-1">
      <div className="common-container ">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/add-post.svg"
            height={36}
            width={36}
            alt="add"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        </div>
        <PostForm post={post} action='update'/>
      </div>
    </div>
  );
};

export default EditPost;
