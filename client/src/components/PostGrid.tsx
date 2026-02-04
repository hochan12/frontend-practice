import { useMemo, useState } from "react";
import "./PostGrid.css";
import { posts, type Post } from "../data/posts";
import PostModal from "./PostModal";
import AuthModal from "./AuthModal";

export default function PostGrid() {
  const list = useMemo(() => posts, []);
  const [selected, setSelected] = useState<Post | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [authOpen, setAuthOpen] = useState(false);

  const onOpenPost = (post: Post) => {
    setSelected(post);
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    setSelected(null);
  };

  return (
    <>
      <div className="grid-container">
        {list.map((post) => (
          <button
            key={post.id}
            className="post-card"
            type="button"
            onClick={() => onOpenPost(post)}
          >
            <img
              src={post.thumbnail}
              alt={`post-${post.id}`}
              className="post-thumb"
            />
          </button>
        ))}
      </div>

      <PostModal
        post={selected}
        isOpen={isOpen}
        onClose={onClose}
        onRequireLogin={() => setAuthOpen(true)}
      />

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}