import { useState, useEffect } from "react";
import axios from "axios";
import {
  AppBar, Toolbar, Button, Typography, Container, Grid, Card, CardContent,
  TextField, CircularProgress, Box, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Dashboard({ user, setUser }) {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: "", content: "" });
  const [editingBlog, setEditingBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchUserBlogs();
  }, [user, navigate]);

  const fetchUserBlogs = async () => {
    if (!user?.id) {
      setError("User ID is missing");
      return;
    }

    console.log("Fetching blogs for user ID:", user.id);

    try {
      const response = await axios.get(`http://localhost:8080/api/blogs/user/${user.id}`, {
        headers: {
          Authorization: `Basic ${btoa(`${user.email}:${user.password}`)}`,
        },
      });

      console.log("API Response:", response.data);

      if (Array.isArray(response.data)) {
        setBlogs([...response.data]); // ✅ Force state update
      } else if (response.data) {
        setBlogs([response.data]); // ✅ Convert single object to array
      } else {
        setBlogs([]);
        setError("No blogs found");
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);

      if (err.response) {
        if (err.response.status === 404) {
          setBlogs([]);
          setError("No blogs found for this user");
        } else {
          setError(`Error: ${err.response.status} - ${err.response.statusText}`);
        }
      } else {
        setError("Network error - Could not connect to server");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Updated Blogs:", blogs);
  }, [blogs]); // ✅ Debugging state updates

  const handleAddBlog = async () => {
    if (!newBlog.title.trim() || !newBlog.content.trim()) return;

    try {
      const response = await axios.post(
        "http://localhost:8080/api/blogs",
        {
          title: newBlog.title.trim(),
          content: newBlog.content.trim(),
        },
        {
          headers: {
            Authorization: `Basic ${btoa(`${user.email}:${user.password}`)}`,
            "Content-Type": "application/json",
          },
        }
      );

      setBlogs([...blogs, response.data]); // ✅ Update UI
      setNewBlog({ title: "", content: "" });
    } catch (err) {
      setError("Error adding blog");
    }
  };

  const handleUpdateBlog = async () => {
    if (!editingBlog?.title.trim() || !editingBlog?.content.trim()) return;

    try {
      const response = await axios.put(
        `http://localhost:8080/api/blogs/${editingBlog.id}`,
        {
          title: editingBlog.title.trim(),
          content: editingBlog.content.trim(),
        },
        {
          headers: {
            Authorization: `Basic ${btoa(`${user.email}:${user.password}`)}`, // ✅ Added Auth Header
            "Content-Type": "application/json",
          },
        }
      );

      setBlogs(blogs.map(blog => blog.id === editingBlog.id ? response.data : blog));
      setEditingBlog(null);
    } catch (err) {
      console.error("Error updating blog:", err);
      setError("Failed to update blog. Please check authentication.");
    }
  };


  const handleDeleteBlog = async (blogId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/blogs/${blogId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${btoa(`${user.email}:${user.password}`)}`, // ✅ Added Auth Header
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete blog. Status: ${response.status}`);
      }

      // ✅ Update state after successful deletion
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId));
    } catch (err) {
      console.error("Error deleting blog:", err.message);
    }
  };



  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/", { replace: true }); // Prevents back navigation
    window.location.reload(); // Ensures immediate re-render
  };



  return (
    <div>
      {/* Navbar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Welcome, {user?.name || user?.email}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        {/* User Details */}
        <Box sx={{ mb: 4, p: 3, border: '1px solid #ddd', borderRadius: 1 }}>
          <Typography variant="h5">User Details</Typography>
          <Typography>Email: {user?.email}</Typography>
        </Box>

        {/* Blogs Section */}
        <Typography variant="h4" sx={{ mb: 3 }}>Your Blogs</Typography>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : blogs.length === 0 ? (
          <Typography>No blogs found. Create your first blog!</Typography>
        ) : (
          <Grid container spacing={3}>
            {blogs.map((blog) => (
              <Grid item xs={12} sm={6} md={4} key={blog.id}>
                <Card>
                  <CardContent>
                    <Typography gutterBottom variant="h5">{blog.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{blog.content}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <IconButton onClick={() => setEditingBlog(blog)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteBlog(blog.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Add New Blog */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Add New Blog</Typography>
          <TextField
            fullWidth
            label="Title"
            value={newBlog.title}
            onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Content"
            multiline
            rows={4}
            value={newBlog.content}
            onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleAddBlog}
            sx={{ mt: 2 }}
            disabled={!newBlog.title || !newBlog.content}
          >
            Add Blog
          </Button>
        </Box>
      </Container>

      {/* Edit Blog Dialog */}
      <Dialog open={Boolean(editingBlog)} onClose={() => setEditingBlog(null)}>
        <DialogTitle>Edit Blog</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={editingBlog?.title || ''}
            onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Content"
            fullWidth
            multiline
            rows={4}
            value={editingBlog?.content || ''}
            onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingBlog(null)}>Cancel</Button>
          <Button onClick={handleUpdateBlog}>Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
