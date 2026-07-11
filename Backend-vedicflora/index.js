const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
require("dotenv").config();


// Initialize Firebase Admin SDK 
const serviceAccount = {
  type: process.env.TYPE || "service_account",
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: (process.env.PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN
};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
app.use(cors());
app.use(express.json());

// Register User
app.post("/api/auth/register", async (req, res) => {
  const { uid, fullName, email } = req.body;

  try {
    // Check if user document already exists in Firestore
    const userDoc = await db.collection("users").doc(uid).get();

    if (userDoc.exists) {
      // Just return success if user already exists
      return res.status(200).json({
        id: uid,
        fullName,
        email,
      });
    }

    // Store additional user data in Firestore
    await db.collection("users").doc(uid).set({
      fullName,
      email,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      id: uid,
      fullName,
      email,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});

// Login User - Not needed with Firebase Auth
// The client will handle login directly with Firebase SDK
app.post("/api/auth/login", async (req, res) => {
  // Just for compatibility with your frontend - in production,
  // you might want to remove this and handle auth directly in the frontend
  const { email } = req.body;

  try {
    // Let Firebase handle the authentication
    const userCredential = await admin.auth().getUserByEmail(email);

    // Generate a custom token for the user
    const customToken = await admin
      .auth()
      .createCustomToken(userCredential.uid);

    // Get user data from Firestore
    const userDoc = await db.collection("users").doc(userCredential.uid).get();
    const userData = userDoc.data() || {};

    res.status(200).json({
      token: customToken,
      user: {
        id: userCredential.uid,
        fullName: userData.fullName || userCredential.displayName,
        email: userCredential.email,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Middleware to Verify Firebase Auth Token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Contains uid, email, etc.
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

// Protected Route Example
app.get("/api/auth/profile", verifyToken, async (req, res) => {
  try {
    // First get the user from Firebase Auth
    const userRecord = await admin.auth().getUser(req.user.uid);

    // Then get additional data from Firestore
    const userRef = db.collection("users").doc(req.user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Combine the data
    const userData = userDoc.data();
    res.status(200).json({
      ...userData,
      email: userRecord.email, // Use email from Auth
      displayName: userRecord.displayName, // Use displayName from Auth
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update all other endpoints that use verifyToken...
// For each one, replace req.user.id with req.user.uid

app.put("/api/auth/update-profile", verifyToken, async (req, res) => {
  const { fullName, phoneNumber } = req.body;

  try {
    // Update in Firebase Auth
    await admin.auth().updateUser(req.user.uid, {
      displayName: fullName,
    });

    // Update in Firestore
    const userRef = db.collection("users").doc(req.user.uid);
    await userRef.update({ fullName, phoneNumber });

    const updatedUser = (await userRef.get()).data();
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Similarly update all other endpoints that use req.user.id to use req.user.uid
// Here are a few examples - you'll need to do this for all endpoints

app.put("/api/auth/update-address", verifyToken, async (req, res) => {
  const { address } = req.body;

  try {
    const userRef = db.collection("users").doc(req.user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = userDoc.data();
    const updatedAddresses = userData.addresses
      ? [
          ...userData.addresses.filter((addr) => addr.id !== address.id),
          address,
        ]
      : [address];

    await userRef.update({ addresses: updatedAddresses });
    res.status(200).json(updatedAddresses);
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/api/auth/update-payment-method", verifyToken, async (req, res) => {
  const { paymentMethod } = req.body;

  try {
    const userRef = db.collection("users").doc(req.user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = userDoc.data();
    const updatedPaymentMethods = userData.paymentMethods
      ? [
          ...userData.paymentMethods.filter(
            (method) => method.id !== paymentMethod.id
          ),
          paymentMethod,
        ]
      : [paymentMethod];

    await userRef.update({ paymentMethods: updatedPaymentMethods });
    res.status(200).json(updatedPaymentMethods);
  } catch (error) {
    console.error("Error updating payment method:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/api/auth/cancel-order", verifyToken, async (req, res) => {
  const { orderId } = req.body;

  try {
    const userRef = db.collection("users").doc(req.user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = userDoc.data();
    const orderToCancel = userData.orders.find((order) => order.id === orderId);

    if (!orderToCancel) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update stock values for the canceled order
    const batch = db.batch();
    for (const item of orderToCancel.items) {
      if (!item.product || !item.product.id) {
        console.error("Invalid product in order:", item);
        continue; // Skip invalid items
      }

      const productRef = db.collection("products").doc(item.product.id);
      const productSnap = await productRef.get();

      if (productSnap.exists) {
        const currentStock = productSnap.data().stock || 0;
        batch.update(productRef, { stock: currentStock + item.quantity });
      }
    }
    await batch.commit();

    // Update the order status
    const updatedOrders = userData.orders.map((order) =>
      order.id === orderId ? { ...order, status: "Order Cancelled" } : order
    );

    await userRef.update({ orders: updatedOrders });
    res.status(200).json(updatedOrders);
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/api/auth/delete-address/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const userRef = db.collection("users").doc(req.user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = userDoc.data();
    const updatedAddresses = userData.addresses.filter(
      (addr) => addr.id !== id
    );

    await userRef.update({ addresses: updatedAddresses });
    res.status(200).json(updatedAddresses);
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete(
  "/api/auth/delete-payment-method/:id",
  verifyToken,
  async (req, res) => {
    const { id } = req.params;

    try {
      const userRef = db.collection("users").doc(req.user.uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return res.status(404).json({ message: "User not found" });
      }

      const userData = userDoc.data();
      const updatedPaymentMethods = userData.paymentMethods.filter(
        (method) => method.id !== id
      );

      await userRef.update({ paymentMethods: updatedPaymentMethods });
      res.status(200).json(updatedPaymentMethods);
    } catch (error) {
      console.error("Error deleting payment method:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

app.get("/api/auth/shipping-data", verifyToken, async (req, res) => {
  try {
    const userRef = db.collection("users").doc(req.user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = userDoc.data();
    res.status(200).json({
      addresses: userData.addresses || [],
      paymentMethods: userData.paymentMethods || [],
    });
  } catch (error) {
    console.error("Error fetching shipping data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Check if the user is an admin
app.get("/api/auth/check-admin", verifyToken, async (req, res) => {
  try {
    const userRef = db.collection("users").doc(req.user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = userDoc.data();

    if (userData.role === "admin") {
      return res.status(200).json({ isAdmin: true });
    } else {
      return res.status(403).json({ isAdmin: false, message: "Access denied" });
    }
  } catch (error) {
    console.error("Error checking admin status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Products API Endpoint
app.get("/api/products", async (req, res) => {
  try {
    const productsRef = db.collection("products");
    const snapshot = await productsRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No products found" });
    }

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/products/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const productsRef = db.collection("products");
    const snapshot = await productsRef.where("slug", "==", slug).get();

    if (snapshot.empty) {
      return res
        .status(404)
        .json({ message: "No product found with the given slug" });
    }

    const product = snapshot.docs[0].data();
    res.status(200).json({ id: snapshot.docs[0].id, ...product });
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/blogs", async (req, res) => {
  try {
    const blogsRef = db.collection("blogData");
    const snapshot = await blogsRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No blogs found" });
    }

    const blogs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/blogs/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const blogsRef = db.collection("blogData");
    const snapshot = await blogsRef.where("slug", "==", slug).get();

    if (snapshot.empty) {
      return res
        .status(404)
        .json({ message: "No blog found with the given slug" });
    }

    const blog = snapshot.docs[0].data();
    res.status(200).json({ id: snapshot.docs[0].id, ...blog });
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/nurseries", async (req, res) => {
  try {
    const nurseriesRef = db.collection("Nursery");
    const snapshot = await nurseriesRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No nurseries found" });
    }

    const nurseries = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(nurseries);
  } catch (error) {
    console.error("Error fetching nurseries:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Fetch all reviews
app.get("/api/reviews", async (req, res) => {
  try {
    const reviewsRef = db.collection("reviews");
    const snapshot = await reviewsRef.orderBy("timestamp", "desc").get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No reviews found" });
    }

    const reviews = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add a new review
app.post("/api/reviews", async (req, res) => {
  const { name, email, title, review, rating, recommend, plantType, userId } =
    req.body;

  try {
    const newReview = {
      name,
      email,
      title,
      review,
      rating,
      recommend,
      plantType: plantType || "Not specified",
      verified: true, // Assuming all reviews are verified
      timestamp: new Date().getTime(),
      date: "Just Now",
      userId: userId || null,
    };

    const docRef = await db.collection("reviews").add(newReview);

    res.status(201).json({ id: docRef.id, ...newReview });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/orders", verifyToken, async (req, res) => {
  const { cart, selectedAddress, selectedPaymentMethod } = req.body;

  try {
    // Calculate total amount and tax
    const totalAmount = cart.reduce((total, item) => {
      const itemPrice =
        item.product.price * (1 - (item.product.discount || 0) / 100);
      return total + itemPrice * item.quantity;
    }, 0);
    const taxAmount = totalAmount * 0.18; // 18% tax
    const finalAmount = totalAmount + taxAmount;

    // Create order data
    const orderData = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: cart,
      address: selectedAddress,
      paymentMethod: selectedPaymentMethod,
      status: "Order Successful",
      totalAmount: Math.round(finalAmount),
    };

    // Update stock for each product in the cart
    const batch = db.batch();
    for (const item of cart) {
      const productRef = db.collection("products").doc(item.product.id);
      const productSnap = await productRef.get();

      if (productSnap.exists) {
        const currentStock = productSnap.data().stock || 0;
        const newStock = Math.max(currentStock - item.quantity, 0);
        batch.update(productRef, { stock: newStock });
      }
    }
    await batch.commit();

    // Save the order in the user's profile
    const userRef = db.collection("users").doc(req.user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = userDoc.data();
    const updatedOrders = userData.orders
      ? [...userData.orders, orderData]
      : [orderData];
    await userRef.update({ orders: updatedOrders });

    res.status(201).json(orderData);
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/orders", verifyToken, async (req, res) => {
  try {
    const userRef = db.collection("users").doc(req.user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = userDoc.data();
    res.status(200).json(userData.orders || []);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/admin/dashboard-data", verifyToken, async (req, res) => {
  try {
    // Ensure the user is an admin
    const userRef = db.collection("users").doc(req.user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists || userDoc.data().role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Fetch users
    const usersSnapshot = await db.collection("users").get();
    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Fetch products
    const productsSnapshot = await db.collection("products").get();
    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Fetch blogs
    const blogsSnapshot = await db.collection("blogData").get();
    const blogs = blogsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Fetch nurseries
    const nurseriesSnapshot = await db.collection("Nursery").get();
    const nurseries = nurseriesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Aggregate orders from all users
    let allOrders = [];
    let totalRevenue = 0;

    users.forEach((user) => {
      if (user.orders && Array.isArray(user.orders)) {
        user.orders.forEach((order) => {
          const formattedOrder = {
            ...order,
            userId: user.id,
            userName: user.fullName || "Unknown User",
            userEmail: user.email,
            phoneNumber: user.phoneNumber || "N/A",
            shippingAddress: order.address
              ? {
                  street: order.address.street,
                  city: order.address.city,
                  state: order.address.state,
                  zipCode: order.address.zip,
                }
              : null,
            items: order.items || [],
          };

          allOrders.push(formattedOrder);
          totalRevenue += order.totalAmount || 0;
        });
      }
    });

    // Sort orders by date (newest first)
    allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Prepare dashboard stats
    const stats = {
      totalUsers: users.length,
      totalProducts: products.length,
      totalOrders: allOrders.length,
      totalRevenue: totalRevenue,
      recentOrders: allOrders.slice(0, 5),
    };

    // Send the aggregated data
    res.status(200).json({
      users,
      products,
      blogs,
      nurseries,
      orders: allOrders,
      stats,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
