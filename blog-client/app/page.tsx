"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchBlogs } from "@/store/reducers/blogReducer";
import BlogItem from "./components/blogItem";
import CreateBlogModal from "./components/createBlogModal";
import { Container, Typography, Button } from "@mui/material";

export default function BlogList() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { blogs, loading } = useSelector((state: any) => state.blogs);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  // Function to handle the "Create New Blog" button click
  const handleCreateClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // Redirect to login if no token
    } else {
      setOpen(true);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mb: 3, mt: 2 }}>
        Blogs
      </Typography>
      <Button variant="contained" color="primary" onClick={handleCreateClick}>
        Create New Blog
      </Button>
      {blogs.map((blog) => (
        <BlogItem key={blog.documentid} blog={blog} />
      ))}
      <CreateBlogModal open={open} handleClose={() => setOpen(false)} />
    </Container>
  );
}
