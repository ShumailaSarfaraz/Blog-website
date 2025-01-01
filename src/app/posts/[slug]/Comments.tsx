'use client'
import { useState, useEffect } from "react";
import { Trash } from 'lucide-react'

interface Comment {
  name: string;
  comment: string;
}

const Comments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");

  // Load comments from localStorage when the component mounts
  useEffect(() => {
    const savedComments = localStorage.getItem("comments");
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, []);

  // Save comments to localStorage whenever the comments state changes
  useEffect(() => {
    if (comments.length > 0) {
      localStorage.setItem("comments", JSON.stringify(comments));
    }
  }, [comments]);

  // Handle form submission to add a new comment
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && comment) {
      const newComment: Comment = { name, comment };
      const updatedComments = [...comments, newComment];
      setComments(updatedComments);
      setName("");
      setComment("");
    }
  };

  // Handle comment deletion
  const handleDelete = (index: number) => {
    const updatedComments = comments.filter((_, i) => i !== index);
    setComments(updatedComments);
  };

  return (
    <div className="comment-section mt-8">
      <h2 className="text-xl mb-4">Leave a Comment</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          className="border p-2 mb-2 w-full"
          required
        />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Your Comment"
          className="border p-2 mb-4 w-full"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Submit Comment
        </button>
      </form>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p>No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment, index) => (
            <div key={index} className="comment mb-4">
              <p className="font-bold">{comment.name}</p>
              <p>{comment.comment}</p>
              <button
                onClick={() => handleDelete(index)}
                className="bg-red-500 text-white p-1 rounded mt-2"
              >
                <Trash/>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
