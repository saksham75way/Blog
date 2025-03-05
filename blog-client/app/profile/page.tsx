"use client";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "@/store/reducers/userReducer";
import { Container, Typography, CircularProgress } from "@mui/material";
import BlogItem from "@/app/components/blogItem";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user, blogs, loading, error } = useSelector(
    (state: any) => state.user
  );

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile() as any);
    }
  }, [dispatch, user]); // Fetch only if user data is not available

  // Remove duplicate blogs based on unique blog ID
  const uniqueBlogs = useMemo(() => {
    const blogMap = new Map();
    blogs.forEach((blog) => blogMap.set(blog.documentId, blog));
    return Array.from(blogMap.values());
  }, [blogs]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mb: 3 }}>
        {user?.username}'s Profile
      </Typography>
      <Typography>Email: {user?.email}</Typography>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Your Blogs
      </Typography>
      {uniqueBlogs.length > 0 ? (
        uniqueBlogs.map((blog) => <BlogItem key={blog.id} blog={blog} />)
      ) : (
        <Typography>No blogs found.</Typography>
      )}
    </Container>
  );
}
