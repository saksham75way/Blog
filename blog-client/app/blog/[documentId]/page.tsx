"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { fetchBlogs } from "@/store/reducers/blogReducer";
import {
  fetchComments,
  addComment,
  deleteComment,
} from "@/store/reducers/commentReducer";
import { jwtDecode } from "jwt-decode";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function BlogDetailPage() {
  const { documentId } = useParams();
  const dispatch = useDispatch();
  const { blogs, loading } = useSelector((state: any) => state.blogs);
  const { comments } = useSelector((state: any) => state.comments);
  const [comment, setComment] = useState("");
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchBlogs());
    dispatch(fetchComments(Number(documentId)));

    // Decode token to get user ID
    const token = localStorage.getItem("token");
    if (token) {
      const decoded: any = jwtDecode(token);
      setUserId(decoded.id);
    }
  }, [dispatch, documentId]);

  const blog = blogs.find((b: any) => b.id == documentId);

  const handleAddComment = () => {
    if (!comment) return;
    dispatch(addComment({ blogId: Number(documentId), content: comment }));
    setComment("");
    dispatch(fetchComments(Number(documentId)));
  };

  const handleDeleteComment = (commentId: number) => {
    dispatch(deleteComment(commentId))
      .unwrap()
      .then(() => {
        dispatch(fetchComments(Number(documentId)));
      })
      .catch((error) => console.error("Error deleting comment:", error));
  };
  if (loading) return <CircularProgress />;
  if (!blog) return <Typography color="error">Blog not found</Typography>;

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" color="primary" fontWeight="bold">
          {blog.title}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {blog.content}
        </Typography>
        <Typography variant="subtitle2" sx={{ mt: 2, fontStyle: "italic" }}>
          Author: {blog.user?.username || "Unknown"}
        </Typography>

        {/* Comments Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Comments</Typography>
          {comments.length > 0 ? (
            comments.map((c, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  my: 1,
                  bgcolor: "#f5f5f5",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body2">{c.content}</Typography>
                {c.users_permissions_user?.id === userId && (
                  <IconButton
                    onClick={() => handleDeleteComment(c.documentId)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            ))
          ) : (
            <Typography variant="body2">No comments yet.</Typography>
          )}

          {/* Add Comment */}
          <TextField
            fullWidth
            label="Add a comment..."
            variant="outlined"
            sx={{ mt: 2 }}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 1 }}
            onClick={handleAddComment}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
