import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Pagination,
  CardMedia,
  Box,
} from "@mui/material";
import styles from "./Homepage.module.css";

// Sample image URLs for blogs
const sampleImages = [
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
  "https://images.unsplash.com/photo-1455390582262-044cdead277a",
  "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
];

export default function Homepage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/blogs?page=${page - 1}&size=20` // Request 20 blogs per page
        );

        setBlogs(response.data.content || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        setError("Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div className={styles.mainContainer}>
      <AppBar position="static" className={styles.navbar}>
        <Toolbar>
          <Typography variant="h6" className={styles.navbarTitle}>
            Blog App
          </Typography>
          {user ? (
            <>
              <Typography className={styles.welcomeText}>Welcome, {user.email}</Typography>
              <Button 
                className={styles.navbarButton} 
                onClick={() => {
                  localStorage.removeItem("user");
                  setUser(null);
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                className={styles.navbarButton} 
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button 
                className={styles.navbarButton} 
                onClick={() => navigate("/signup")}
              >
                Signup
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <div className={styles.contentContainer}>
        <Container 
          maxWidth={false}
          sx={{ 
            width: '80%',
            margin: '0 auto',
            mt: 4,
            px: 0
          }}
        >
          {loading ? (
            <Box className={styles.loadingContainer}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography className={styles.errorText}>{error}</Typography>
          ) : blogs.length === 0 ? (
            <Typography className={styles.noBlogsText}>No blogs found.</Typography>
          ) : (
            <>
              <Grid container spacing={3} className={styles.blogGrid}>
                {blogs.map((blog, index) => (
                  <Grid item xs={12} sm={6} md={4} key={blog.id}>
                    <Card className={styles.blogCard}>
                      <CardMedia
                        component="img"
                        className={styles.blogImage}
                        image={`${sampleImages[index % sampleImages.length]}?w=500&auto=format`}
                        alt={blog.title}
                      />
                      <CardContent className={styles.blogContent}>
                        <Typography gutterBottom variant="h5" component="div">
                          {blog.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {blog.content.length > 100
                            ? `${blog.content.substring(0, 100)}...`
                            : blog.content}
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                          By: {blog.authorEmail}
                        </Typography>
                        <Typography variant="caption" display="block">
                          Posted: {new Date(blog.createdAt).toLocaleDateString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {totalPages > 1 && (
                <Box className={styles.pagination}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
            </>
          )}
        </Container>
      </div>  
    </div>
  );
}