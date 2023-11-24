const { connectDB } = require("./db");
const Message = require("./models/message");
const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");
const admin = require("firebase-admin");
const serviceAccount = require("./feather-chat-ea380-firebase-adminsdk-bg00t-3ee9ffb0ae.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://feather-chat-ea380-default-rtdb.firebaseio.com",
});
const LoginController = require("./controllers/LoginController");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
// Define a schema and model for messages (you can add more fields as needed)

// Serve static files (you can add a frontend later)
app.use(express.static(__dirname + "/public"));
console.log(process.env.MONGODB_URL);

// Socket.io setup for real-time communication
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  // Handle incoming messages
  socket.on("chat message", async (msg) => {
    const message = new Message(msg);

    try {
      await message.save();
      io.emit("chat message", message);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
app.get("/", (req, res) => {
  res.send({ name: "vidhyan" });
});
app.post("/send_notification", async (req, res) => {
  try {
    let registrationToken = await req.body.token;
    let notification = await req.body.notification;
    console.log(registrationToken, notification, "req");
    const message = {
      notification: notification,
      data: notification,
     
      token: registrationToken,
    };
    await admin
      .messaging()
      .send({message:message})
      .then((res) => {
        console.log(res, "res");
      });

    res.json({ message: "Notification sent successfully" });
  } catch (err) {
    console.log(err);
    res.json({ message: "Error sending notification" });
  }
});
app.post("/login", LoginController);
