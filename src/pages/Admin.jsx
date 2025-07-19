import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../../firebase";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  FaUsers,
  FaLeaf,
  FaBlog,
  FaTree,
  FaShoppingCart,
  FaTachometerAlt,
} from "react-icons/fa";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Textarea } from "../components/ui/textarea";
import { motion } from "framer-motion";
import { storage } from "../../appwrite"; // Import Appwrite storage

function Admin() {
  const { user } = useAuth(); // Assuming you have a context or hook to get the current user
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Data states
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [nurseries, setNurseries] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
  });

  // Dialog states
  const [productDialog, setProductDialog] = useState(false);
  const [blogDialog, setBlogDialog] = useState(false);
  const [nurseryDialog, setNurseryDialog] = useState(false);
  const [orderDialog, setOrderDialog] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Edit/Add states
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [currentNursery, setCurrentNursery] = useState(null);
  const [images, setImages] = useState({
    image1: null,
    image2: null,
    image3: null,
  });

  // Fetch all data for dashboard
  const fetchAllData = useCallback(async () => {
    try {
      console.log("Fetching dashboard data...");
      setIsLoading(true); // Set loading to true when starting fetch

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        navigate("/signin");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/dashboard-data`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();
      console.log("Dashboard data fetched successfully:", data);

      // Update state with the fetched data
      setUsers(data.users);
      setProducts(data.products);
      setBlogs(data.blogs);
      setNurseries(data.nurseries);
      setOrders(data.orders);

      const totalRevenue = data.stats.totalRevenue;
      const canceledAmount = data.orders
        .filter((order) => order.status === "Order Cancelled")
        .reduce(
          (total, order) => total + (parseFloat(order.totalAmount) || 0),
          0
        );

      // Update stats with adjusted revenue
      setStats({
        ...data.stats,
        totalRevenue: totalRevenue - canceledAmount,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      alert("Error loading data. Please try again.");
    } finally {
      setIsLoading(false); // Set loading to false when fetch completes
    }
  }, [navigate]);

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        console.log("No user found, redirecting to /signin");
        navigate("/signin");
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/check-admin`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 403) {
            console.log("Access denied: User is not an admin");
            alert("You don't have permission to access the admin panel");
            navigate("/");
          } else {
            throw new Error("Failed to verify admin status");
          }
          return;
        }

        const data = await response.json();
        console.log("Admin check response:", data);

        if (data.isAdmin) {
          setIsAdmin(true);
          console.log("User is admin, fetching dashboard data...");
          fetchAllData();
        } else {
          console.log("User is not an admin, redirecting to /");
          navigate("/");
          alert("You don't have permission to access the admin panel");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        navigate("/");
      }
    };

    checkAdmin();
  }, [user, navigate, fetchAllData]);

  // Handle image upload
  const handleImageUpload = async (file, bucketId) => {
    if (!file) return null;

    try {
      // Upload the file to Appwrite Storage
      const response = await storage.createFile(bucketId, "unique()", file);

      // Get the public URL of the uploaded file
      const fileUrl = storage.getFileView(bucketId, response.$id);
      return fileUrl;
    } catch (error) {
      console.error("Error uploading image to Appwrite:", error);
      throw error;
    }
  };

  // const deleteFileFromAppwrite = async (fileUrl, bucketId) => {
  //   if (!fileUrl) return;

  //   try {
  //     const fileId = new URL(fileUrl).pathname.split("/").pop();
  //     await storage.deleteFile(bucketId, fileId);
  //   } catch (error) {
  //     console.error("Error deleting file from Appwrite:", error);
  //   }
  // };

  // Product CRUD Operations
  const handleAddEditProduct = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);
      const productData = {
        title: formData.get("title"),
        slug: formData.get("slug"),
        description: formData.get("description"),
        price: parseFloat(formData.get("price")),
        discount: parseFloat(formData.get("discount") || 0),
        featuredProduct: formData.get("featured") === "on", // Retrieve checkbox value
        stock: parseInt(formData.get("stock")),
        altText: formData.get("altText") || formData.get("title"),
        blogSlug: formData.get("blogSlug") || "",
      };

      const bucketId = "67c18af2003a4c58909d"; // Replace with your Appwrite bucket ID

      // Handle image uploads
      if (images.image1) {
        productData.image1 = await handleImageUpload(images.image1, bucketId);
      }
      if (images.image2) {
        productData.image2 = await handleImageUpload(images.image2, bucketId);
      }
      if (images.image3) {
        productData.image3 = await handleImageUpload(images.image3, bucketId);
      }

      if (currentProduct) {
        // Update existing product
        const productRef = doc(db, "products", currentProduct.id);
        await updateDoc(productRef, productData);
      } else {
        // Add new product
        await addDoc(collection(db, "products"), productData);
      }

      setProductDialog(false);
      setCurrentProduct(null);
      setImages({ image1: null, image2: null, image3: null });
      alert(`Product ${currentProduct ? "updated" : "added"} successfully!`);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product. Please try again.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const product = products.find((p) => p.id === productId);
      const bucketId = "67c18af2003a4c58909d"; // Replace with your Appwrite bucket ID

      const deleteFileIfExists = async (fileUrl) => {
        if (!fileUrl) return;
        const fileId = new URL(fileUrl).pathname.split("/").pop();
        try {
          await storage.getFile(bucketId, fileId); // Check if file exists
          await storage.deleteFile(bucketId, fileId); // Delete file
        } catch (error) {
          if (error.code !== 404) throw error; // Ignore "file not found" errors
        }
      };

      // Delete associated images
      await deleteFileIfExists(product.image1);
      await deleteFileIfExists(product.image2);
      await deleteFileIfExists(product.image3);

      // Delete product from Firestore
      await deleteDoc(doc(db, "products", productId));
      setProducts(products.filter((product) => product.id !== productId));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product. Please try again.");
    }
  };

  // Blog CRUD Operations
  const handleAddEditBlog = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);
      const blogData = {
        title: formData.get("title"),
        Sname: formData.get("Sname"),
        Huse: formData.get("Huse"),
        slug: formData.get("slug"),
        Ph: formData.get("Ph"),
        Mh: formData.get("Mh"),
        TMuse: formData.get("TMuse"),
        soil: formData.get("soil"),
        sunlight: formData.get("sunlight"),
        water: formData.get("water"),
        care: formData.get("care"),
        featuredProduct: formData.get("featuredProduct") === "on",
        altText: formData.get("altText") || formData.get("title"),
        publishDate: currentBlog
          ? currentBlog.publishDate
          : new Date().toISOString(),
      };

      const bucketId = "67c18af2003a4c58909d"; // Replace with your Appwrite bucket ID

      // Handle image uploads
      if (images.image1) {
        blogData.image1 = await handleImageUpload(images.image1, bucketId);
      } else if (currentBlog?.image1) {
        blogData.image1 = currentBlog.image1; // Retain the existing image if no new image is uploaded
      }

      if (images.image2) {
        blogData.image2 = await handleImageUpload(images.image2, bucketId);
      } else if (currentBlog?.image2) {
        blogData.image2 = currentBlog.image2; // Retain the existing image if no new image is uploaded
      }

      if (currentBlog) {
        // Update existing blog
        const blogRef = doc(db, "blogData", currentBlog.id);
        await updateDoc(blogRef, blogData);

        // Update local state
        setBlogs(
          blogs.map((blog) =>
            blog.id === currentBlog.id
              ? { ...blogData, id: currentBlog.id }
              : blog
          )
        );
      } else {
        // Add new blog
        const docRef = await addDoc(collection(db, "blogData"), blogData);

        // Update local state
        setBlogs([...blogs, { ...blogData, id: docRef.id }]);
      }

      setBlogDialog(false);
      setCurrentBlog(null);
      setImages({ image1: null, image2: null });
      alert(`Blog ${currentBlog ? "updated" : "added"} successfully!`);
    } catch (error) {
      console.error("Error saving blog:", error);
      alert(
        `Error ${currentBlog ? "updating" : "adding"} blog. Please try again.`
      );
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      await deleteDoc(doc(db, "blogData", blogId));

      // Delete associated images
      const storage = getStorage();
      try {
        const blog = blogs.find((b) => b.id === blogId);
        if (blog) {
          if (blog.image1) {
            const imageRef = ref(storage, blog.image1);
            await deleteObject(imageRef);
          }
          if (blog.image2) {
            const imageRef = ref(storage, blog.image2);
            await deleteObject(imageRef);
          }
        }
      } catch (imgError) {
        console.error("Error deleting blog images:", imgError);
      }

      // Update state
      setBlogs(blogs.filter((blog) => blog.id !== blogId));
      alert("Blog deleted successfully!");
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Error deleting blog. Please try again.");
    }
  };

  // Nursery CRUD Operations
  const handleAddEditNursery = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);
      const nurseryData = {
        title: formData.get("title"),
        description: formData.get("description"),
        city: formData.get("city"),
        email: formData.get("email"),
        hours: formData.get("hours"),
        altText: formData.get("altText") || formData.get("title"),
      };

      const bucketId = "67c18af2003a4c58909d"; // Replace with your Appwrite bucket ID

      // Handle image upload
      if (images.image1) {
        nurseryData.image = await handleImageUpload(images.image1, bucketId);
      } else if (currentNursery?.image) {
        nurseryData.image = currentNursery.image; // Retain the existing image if no new image is uploaded
      }

      if (currentNursery) {
        // Update existing nursery
        const nurseryRef = doc(db, "Nursery", currentNursery.id);
        await updateDoc(nurseryRef, nurseryData);

        // Update local state
        setNurseries(
          nurseries.map((nursery) =>
            nursery.id === currentNursery.id
              ? { ...nurseryData, id: currentNursery.id }
              : nursery
          )
        );
      } else {
        // Add new nursery
        const docRef = await addDoc(collection(db, "Nursery"), nurseryData);

        // Update local state
        setNurseries([...nurseries, { ...nurseryData, id: docRef.id }]);
      }

      setNurseryDialog(false);
      setCurrentNursery(null);
      setImages({ image1: null });
      alert(`Nursery ${currentNursery ? "updated" : "added"} successfully!`);
    } catch (error) {
      console.error("Error saving nursery:", error);
      alert(
        `Error ${
          currentNursery ? "updating" : "adding"
        } nursery. Please try again.`
      );
    }
  };

  const handleDeleteNursery = async (nurseryId) => {
    if (!confirm("Are you sure you want to delete this nursery?")) return;

    try {
      await deleteDoc(doc(db, "Nursery", nurseryId));

      // Delete associated image
      const storage = getStorage();
      try {
        const nursery = nurseries.find((n) => n.id === nurseryId);
        if (nursery && nursery.image) {
          const imageRef = ref(storage, nursery.image);
          await deleteObject(imageRef);
        }
      } catch (imgError) {
        console.error("Error deleting nursery image:", imgError);
      }

      // Update state
      setNurseries(nurseries.filter((nursery) => nursery.id !== nurseryId));
      alert("Nursery deleted successfully!");
    } catch (error) {
      console.error("Error deleting nursery:", error);
      alert("Error deleting nursery. Please try again.");
    }
  };

  // Update order status
  const updateOrderStatus = async (userId, orderId, newStatus) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        alert("User not found");
        return;
      }

      const userData = userDoc.data();
      const updatedOrders = userData.orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );

      // Update the order status in Firestore
      await updateDoc(userRef, { orders: updatedOrders });

      // If the new status is "Order Successful," update the stock
      if (newStatus === "Order Successful") {
        const order = userData.orders.find((order) => order.id === orderId);
        if (order && order.items) {
          for (const item of order.items) {
            const productRef = doc(db, "products", item.productId); // Ensure productId exists in the order item
            const productDoc = await getDoc(productRef);

            if (productDoc.exists()) {
              const productData = productDoc.data();
              const newStock = (productData.stock || 0) - (item.quantity || 0);

              // Update the stock in Firestore
              await updateDoc(productRef, { stock: Math.max(newStock, 0) });
            }
          }
        }
      }

      // Update local state
      setOrders(
        orders.map((order) =>
          order.id === orderId && order.userId === userId
            ? { ...order, status: newStatus }
            : order
        )
      );

      alert("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error updating order status. Please try again.");
    }
  };

  // Admin/Staff user management
  const toggleAdminRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";

    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { role: newRole });

      // Update local state
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      alert(`User role updated to ${newRole} successfully!`);
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Error updating user role. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4">
            <svg
              className="animate-spin w-full h-full text-teal-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Loading admin panel
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Please wait while we prepare your dashboard
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // will navigate away due to useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="bg-teal-600 p-3 rounded-lg">
              <FaLeaf className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Vedic Flora Admin
            </h1>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white hover:from-teal-600 hover:to-emerald-700 border-none"
          >
            Back to Site
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2 p-1 mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <TabsTrigger
              value="dashboard"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
            >
              <FaTachometerAlt />
              <span className="hidden md:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
            >
              <FaLeaf />
              <span className="hidden md:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger
              value="blogs"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
            >
              <FaBlog />
              <span className="hidden md:inline">Blogs</span>
            </TabsTrigger>
            <TabsTrigger
              value="nurseries"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
            >
              <FaTree />
              <span className="hidden md:inline">Nurseries</span>
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
            >
              <FaShoppingCart />
              <span className="hidden md:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
            >
              <FaUsers />
              <span className="hidden md:inline">Users</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="overflow-hidden border-none shadow-lg">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                  <FaUsers className="h-8 w-8 text-white/80" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{stats.totalUsers}</div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-none shadow-lg">
                <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4">
                  <FaLeaf className="h-8 w-8 text-white/80" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Total Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">
                    {stats.totalProducts}
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-none shadow-lg">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4">
                  <FaShoppingCart className="h-8 w-8 text-white/80" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Total Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{stats.totalOrders}</div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-none shadow-lg">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4">
                  <svg
                    className="h-8 w-8 text-white/80"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">
                    ₹{Math.round(stats.totalRevenue).toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white">
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription className="text-white/80">
                    Latest 5 orders across the platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gray-50 dark:bg-gray-800">
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stats.recentOrders.map((order) => (
                          <TableRow
                            key={order.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <TableCell className="font-medium">
                              {order.id.substring(0, 8)}...
                            </TableCell>
                            <TableCell>{order.userName || "Unknown"}</TableCell>
                            <TableCell>
                              {new Date(order.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  order.status === "Order Successful"
                                    ? "bg-green-100 text-green-800"
                                    : order.status === "Order Cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {order.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              ₹{order.totalAmount?.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                        {stats.recentOrders.length === 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center py-8 text-gray-500"
                            >
                              No recent orders
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products */}
          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Product Management</CardTitle>
                  <CardDescription>
                    Manage your Ayurvedic products
                  </CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setCurrentProduct(null);
                    setImages({ image1: null, image2: null, image3: null });
                    setProductDialog(true);
                  }}
                  className="bg-teal-600 text-white hover:bg-teal-700"
                >
                  Add New Product
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Featured</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <img
                              src={product.image1}
                              alt={product.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {product.title}
                          </TableCell>
                          <TableCell>₹{product.price}</TableCell>
                          <TableCell>{product.discount || 0}%</TableCell>
                          <TableCell>{product.stock || "N/A"}</TableCell>
                          <TableCell>
                            {product.featuredProduct ? "Yes" : "No"}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setCurrentProduct(product);
                                  setImages({
                                    image1: null,
                                    image2: null,
                                    image3: null,
                                  });
                                  setProductDialog(true);
                                }}
                                className="hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 transition-colors"
                              >
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                                className="bg-white border border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                              >
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {products.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center">
                            No products found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blogs */}
          <TabsContent value="blogs">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Blog Management</CardTitle>
                  <CardDescription>Manage your blog posts</CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setCurrentBlog(null);
                    setImages({ image1: null, image2: null });
                    setBlogDialog(true);
                  }}
                  className="bg-teal-600 text-white hover:bg-teal-700"
                >
                  Add New Blog
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Featured</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blogs.map((blog) => (
                        <TableRow key={blog.id}>
                          <TableCell>
                            <img
                              src={blog.image1}
                              alt={blog.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {blog.title}
                          </TableCell>
                          <TableCell>{blog.slug}</TableCell>
                          <TableCell>
                            {blog.publishDate
                              ? new Date(blog.publishDate).toLocaleDateString()
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {blog.featuredProduct ? "Yes" : "No"}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setCurrentBlog(blog);
                                  setImages({ image1: null, image2: null });
                                  setBlogDialog(true);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteBlog(blog.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {blogs.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center">
                            No blogs found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nurseries */}
          <TabsContent value="nurseries">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Nursery Management</CardTitle>
                  <CardDescription>
                    Manage your nursery locations
                  </CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setCurrentNursery(null);
                    setImages({ image1: null });
                    setNurseryDialog(true);
                  }}
                  className="bg-teal-600 text-white hover:bg-teal-700"
                >
                  Add New Nursery
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Hours</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {nurseries.map((nursery) => (
                        <TableRow key={nursery.id}>
                          <TableCell>
                            <img
                              src={nursery.image}
                              alt={nursery.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {nursery.title}
                          </TableCell>
                          <TableCell>{nursery.city || "N/A"}</TableCell>
                          <TableCell>{nursery.email || "N/A"}</TableCell>
                          <TableCell>{nursery.hours || "N/A"}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setCurrentNursery(nursery);
                                  setImages({ image1: null });
                                  setNurseryDialog(true);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteNursery(nursery.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {nurseries.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center">
                            No nurseries found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>
                  View and manage customer orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.length > 0 ? (
                        orders.map((order) => (
                          <TableRow
                            key={order.id}
                            className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            onClick={() => {
                              setCurrentOrder(order);
                              setOrderDialog(true);
                            }}
                          >
                            <TableCell className="font-medium">
                              {order.id.substring(0, 8)}...
                            </TableCell>
                            <TableCell>{order.userName || "Unknown"}</TableCell>
                            <TableCell>
                              {new Date(order.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {order.items?.length || 0} items
                            </TableCell>
                            <TableCell>
                              ₹{order.totalAmount?.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  order.status === "Order Successful"
                                    ? "bg-green-100 text-green-800"
                                    : order.status === "Order Cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {order.status}
                              </span>
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <div className="flex gap-2">
                                <select
                                  className="text-xs border rounded p-1"
                                  value={order.status}
                                  onChange={(e) =>
                                    updateOrderStatus(
                                      order.userId,
                                      order.id,
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="Order Successful">
                                    Successful
                                  </option>
                                  <option value="Processing">Processing</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Order Cancelled">
                                    Cancelled
                                  </option>
                                </select>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center">
                            No orders found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.fullName || "N/A"}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phoneNumber || "N/A"}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                user.role === "admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {user.role || "user"}
                            </span>
                          </TableCell>
                          <TableCell>{user.orders?.length || 0}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                toggleAdminRole(user.id, user.role)
                              }
                              disabled={user.id === user?.uid}
                              className={
                                user.role === "admin"
                                  ? "text-red-500"
                                  : "text-green-500"
                              }
                            >
                              {user.role === "admin"
                                ? "Remove Admin"
                                : "Make Admin"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {users.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center">
                            No users found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Product Dialog */}
      <Dialog open={productDialog} onOpenChange={setProductDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              {currentProduct
                ? "Update the details of this product"
                : "Fill out the form to add a new product"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddEditProduct} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Product Name*</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={currentProduct?.title || ""}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">
                  Product slug* (URL friendly identifier)
                </Label>
                <Input
                  id="slug"
                  name="slug"
                  defaultValue={currentProduct?.slug || ""}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description*</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={currentProduct?.description || ""}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)*</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={currentProduct?.price || ""}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={currentProduct?.discount || "0"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  defaultValue={currentProduct?.stock || "0"}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="altText">Image Alt Text</Label>
                <Input
                  id="altText"
                  name="altText"
                  defaultValue={currentProduct?.altText || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="blogSlug">Related Blog Slug</Label>
                <Input
                  id="blogSlug"
                  name="blogSlug"
                  defaultValue={currentProduct?.blogSlug || ""}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                defaultChecked={currentProduct?.featuredProduct || false}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <Label htmlFor="featured">Featured Product</Label>
            </div>

            <div className="space-y-2">
              <Label>Product Images</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image1">
                    Main Image {currentProduct?.image1 ? "(Current)" : ""}
                  </Label>
                  {currentProduct?.image1 && (
                    <img
                      src={currentProduct.image1}
                      alt="Current main image"
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                  )}
                  <Input
                    id="image1"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setImages({
                        ...images,
                        image1: e.target.files[0],
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image2">
                    Second Image {currentProduct?.image2 ? "(Current)" : ""}
                  </Label>
                  {currentProduct?.image2 && (
                    <img
                      src={currentProduct.image2}
                      alt="Current second image"
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                  )}
                  <Input
                    id="image2"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setImages({
                        ...images,
                        image2: e.target.files[0],
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image3">
                    Third Image {currentProduct?.image3 ? "(Current)" : ""}
                  </Label>
                  {currentProduct?.image3 && (
                    <img
                      src={currentProduct.image3}
                      alt="Current third image"
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                  )}
                  <Input
                    id="image3"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setImages({
                        ...images,
                        image3: e.target.files[0],
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                {currentProduct ? "Update Product" : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Blog Dialog */}
      <Dialog open={blogDialog} onOpenChange={setBlogDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentBlog ? "Edit Blog" : "Add New Blog"}
            </DialogTitle>
            <DialogDescription>
              {currentBlog
                ? "Update the details of this blog post"
                : "Fill out the form to add a new blog post"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddEditBlog} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Blog Title*</Label>
              <Input
                id="title"
                name="title"
                defaultValue={currentBlog?.title || ""}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug* (URL friendly identifier)</Label>
              <Input
                id="slug"
                name="slug"
                defaultValue={currentBlog?.slug || ""}
                placeholder="ayurvedic-benefits-of-ashwagandha"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="Sname">Scientific Name of plant</Label>
              <Textarea
                id="Sname"
                name="Sname"
                defaultValue={currentBlog?.Sname || ""}
                placeholder=""
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="Huse">Historical Use</Label>
              <Textarea
                id="Huse"
                name="Huse"
                defaultValue={currentBlog?.Huse || ""}
                placeholder=""
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="Ph">Physical Health Benefits</Label>
              <Textarea
                id="Ph"
                name="Ph"
                defaultValue={currentBlog?.Ph || ""}
                placeholder=""
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="Mh">Mental Health Benefits</Label>
              <Textarea
                id="Mh"
                name="Mh"
                defaultValue={currentBlog?.Mh || ""}
                placeholder=""
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="TMuse">Traditional and Modern Uses</Label>
              <Textarea
                id="TMuse"
                name="TMuse"
                defaultValue={currentBlog?.TMuse || ""}
                placeholder=""
                required
              />
            </div>
            <Label>Care Instructions</Label>
            <div className="space-y-2">
              <Label htmlFor="soil">Soil</Label>
              <Textarea
                id="soil"
                name="soil"
                defaultValue={currentBlog?.soil || ""}
                placeholder=""
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sunlight">Sunlight</Label>
              <Textarea
                id="sunlight"
                name="sunlight"
                defaultValue={currentBlog?.sunlight || ""}
                placeholder=""
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="water">Water</Label>
              <Textarea
                id="water"
                name="water"
                defaultValue={currentBlog?.water || ""}
                placeholder=""
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="care">Care</Label>
              <Textarea
                id="care"
                name="care"
                defaultValue={currentBlog?.care || ""}
                placeholder=""
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="altText">Image Alt Text</Label>
              <Input
                id="altText"
                name="altText"
                defaultValue={currentBlog?.altText || ""}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featuredProduct"
                name="featuredProduct"
                defaultChecked={currentBlog?.featuredProduct || false}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <Label htmlFor="featuredProduct">Featured Blog</Label>
            </div>

            <div className="space-y-2">
              <Label>Blog Images</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="blogImage1">
                    Main Image {currentBlog?.image1 ? "(Current)" : ""}
                  </Label>
                  {currentBlog?.image1 && (
                    <img
                      src={currentBlog.image1}
                      alt="Current main image"
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                  )}
                  <Input
                    id="blogImage1"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setImages({
                        ...images,
                        image1: e.target.files[0],
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blogImage2">
                    Second Image {currentBlog?.image2 ? "(Current)" : ""}
                  </Label>
                  {currentBlog?.image2 && (
                    <img
                      src={currentBlog.image2}
                      alt="Current second image"
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                  )}
                  <Input
                    id="blogImage2"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setImages({
                        ...images,
                        image2: e.target.files[0],
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                {currentBlog ? "Update Blog" : "Add Blog"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Nursery Dialog */}
      <Dialog open={nurseryDialog} onOpenChange={setNurseryDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 shadow-lg rounded-xl border-none">
          <DialogHeader className="border-b pb-4 mb-4">
            <DialogTitle className="text-2xl font-bold text-teal-700 dark:text-teal-400">
              {currentNursery ? "Edit Nursery" : "Add New Nursery"}
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              {currentNursery
                ? "Update the details of this nursery"
                : "Fill out the form to add a new nursery"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddEditNursery} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Nursery Name*</Label>
              <Input
                id="title"
                name="title"
                defaultValue={currentNursery?.title || ""}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City*</Label>
                <Input
                  id="city"
                  name="city"
                  defaultValue={currentNursery?.city || ""}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={currentNursery?.email || ""}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hours">Business Hours</Label>
                <Input
                  id="hours"
                  name="hours"
                  defaultValue={currentNursery?.hours || ""}
                  placeholder="e.g. Mon-Fri: 9AM-5PM"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="altText">Image Alt Text</Label>
                <Input
                  id="altText"
                  name="altText"
                  defaultValue={currentNursery?.altText || ""}
                />
              </div>
            </div>

            {/* <div className="space-y-3">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={currentNursery?.description || ""}
                className="resize-none focus:ring-teal-500 focus:border-teal-500"
                placeholder="Describe the nursery and its features..."
              />
            </div> */}

            <div className="space-y-3">
              <Label className="text-sm font-medium">Nursery Image</Label>
              {currentNursery?.image ? (
                <div className="relative group overflow-hidden rounded-lg">
                  <img
                    src={currentNursery.image}
                    alt="Current nursery image"
                    className="w-full h-48 object-cover rounded-lg transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      Current Image
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
                  <span>No image uploaded</span>
                </div>
              )}
              <Input
                id="nurseryImage"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImages({
                    ...images,
                    image1: e.target.files[0],
                  })
                }
                className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-teal-600 file:text-white hover:file:bg-teal-700 transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload a high-quality image to showcase this nursery.
              </p>
            </div>

            <DialogFooter className="border-t pt-4 mt-6">
              <DialogClose asChild>
                <Button variant="outline" className="border-gray-300">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white hover:from-teal-600 hover:to-emerald-700 border-none px-6"
              >
                {currentNursery ? "Update Nursery" : "Add Nursery"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog open={orderDialog} onOpenChange={setOrderDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <FaShoppingCart className="text-teal-600" />
              Order Details
            </DialogTitle>
            <DialogDescription>
              Order #{currentOrder?.id?.substring(0, 8)}... •
              {currentOrder?.date &&
                new Date(currentOrder.date).toLocaleString()}{" "}
              •
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs inline-block ${
                  currentOrder?.status === "Order Successful"
                    ? "bg-green-100 text-green-800"
                    : currentOrder?.status === "Order Cancelled"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {currentOrder?.status || "N/A"}
              </span>
            </DialogDescription>
          </DialogHeader>

          {currentOrder && (
            <div className="space-y-6">
              {/* Customer & Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">Name:</span>
                        <p className="font-medium">
                          {currentOrder.userName || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Email:</span>
                        <p className="font-medium">
                          {currentOrder.userEmail || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">
                          Payment Method:
                        </span>
                        <p className="font-medium">
                          {typeof currentOrder.paymentMethod === "object"
                            ? `${currentOrder.paymentMethod.cardHolderName} (${currentOrder.paymentMethod.cardNumber})`
                            : currentOrder.paymentMethod || "N/A"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {currentOrder.shippingAddress ? (
                        <>
                          <p>{currentOrder.shippingAddress.street}</p>
                          <p>
                            {currentOrder.shippingAddress.city},{" "}
                            {currentOrder.shippingAddress.state}{" "}
                            {currentOrder.shippingAddress.zipCode}
                          </p>
                        </>
                      ) : currentOrder.address ? (
                        <>
                          <p>{currentOrder.address.street}</p>
                          <p>
                            {currentOrder.address.city},{" "}
                            {currentOrder.address.state}{" "}
                            {currentOrder.address.zip}
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-500 italic">
                          No shipping address provided
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Items */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Order Items</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-800">
                      <TableRow>
                        <TableHead className="w-[80px]">Image</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentOrder.items && currentOrder.items.length > 0 ? (
                        currentOrder.items.map((item, index) => {
                          // Handle both direct items and nested product items
                          const itemTitle =
                            item.title ||
                            item.product?.title ||
                            "Unknown Product";
                          const itemPrice =
                            item.price ||
                            Math.round(
                              item.product?.price *
                                (1 - item.product.discount / 100)
                            ) ||
                            0;
                          const itemSlug =
                            item.slug || item.product?.slug || "";
                          const itemImage =
                            item.image || item.product?.image1 || null;
                          const itemQuantity = item.quantity || 1;

                          return (
                            <TableRow key={index}>
                              <TableCell>
                                {itemImage ? (
                                  <img
                                    src={itemImage}
                                    alt={itemTitle}
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                                    No image
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <p className="font-medium">{itemTitle}</p>
                                <p className="text-sm text-gray-500">
                                  SKU: {itemSlug || "N/A"}
                                </p>
                              </TableCell>
                              <TableCell className="text-center">
                                {itemQuantity}
                              </TableCell>
                              <TableCell className="text-right">
                                ₹{itemPrice.toFixed(2)}
                              </TableCell>
                              <TableCell className="text-right">
                                ₹{(itemPrice * itemQuantity).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-4 text-gray-500"
                          >
                            No items in this order
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <div className="flex justify-end">
                <Card className="w-full md:w-72">
                  <CardHeader className="pb-2 bg-gray-50 dark:bg-gray-800">
                    <CardTitle className="text-lg">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span>
                        ₹
                        {currentOrder.subtotal?.toFixed(2) ||
                          currentOrder.totalAmount?.toFixed(2)}
                      </span>
                    </div>
                    {currentOrder.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-₹{currentOrder.discount?.toFixed(2)}</span>
                      </div>
                    )}
                    {currentOrder.shippingCost > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping:</span>
                        <span>₹{currentOrder.shippingCost?.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>₹{currentOrder.totalAmount?.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Admin Actions */}
              <div className="flex justify-between items-center border-t pt-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      Change Status:
                    </span>
                    <select
                      className="border text-sm rounded p-1"
                      value={currentOrder.status}
                      onChange={(e) =>
                        updateOrderStatus(
                          currentOrder.userId,
                          currentOrder.id,
                          e.target.value
                        )
                      }
                    >
                      <option value="Order Successful">Successful</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Order Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <DialogClose asChild>
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    Close
                  </Button>
                </DialogClose>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Admin;
