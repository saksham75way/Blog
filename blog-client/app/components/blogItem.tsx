"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
} from "@mui/material";
import CommentModal from "./commentModal";

export default function BlogItem({ blog }: { blog: any }) {
  const [openComments, setOpenComments] = useState(false);
  const router = useRouter();
  const handleReadMore = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // Redirect to login if no token
    } else {
      router.push(`/blog/${blog.id}`);
    }
  };
  return (
    <>
      <Card
        sx={{
          maxWidth: 600,
          margin: "20px auto",
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            component="h2"
            color="primary"
            fontWeight="bold"
          >
            {blog.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, mb: 2 }}
          >
            {blog.content.substring(0, 150)}...
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: 2,
            pb: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleReadMore}
          >
            Read More
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => setOpenComments(true)}
          >
            Comments
          </Button>
        </CardActions>
      </Card>

      {/* Comment Modal */}
      <CommentModal
        open={openComments}
        onClose={() => setOpenComments(false)}
        blogId={blog.id}
      />
    </>
  );
}
