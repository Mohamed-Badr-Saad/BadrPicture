import GridPostList from "@/components/shared/GridPostList";
import { useUserContext } from "@/context/AuthContext";
import { useGetSavedPosts } from "@/lib/react-queries/queriesAndMutations";

const Saved = () => {
  const { user } = useUserContext();
  const { data: savedPosts, isLoading } = useGetSavedPosts(user.id);
  // console.log(savedPosts);

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Saved Posts</h2>
      </div>

      {savedPosts?.documents.length === 0 && (
        <div className="flex items-center justify-center h-80">
          <p className="text-light-4">No saved posts</p>
        </div>
      )}
      
      <GridPostList
        posts={savedPosts?.documents || []}
        savedPostsInput={true}
      />
    </div>
  );
};

export default Saved;
