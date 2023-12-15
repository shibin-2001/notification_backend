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

// // Serve static files (you can add a frontend later)
// app.use(express.static(__dirname + "/public"));
// console.log(process.env.MONGODB_URL);

// // Socket.io setup for real-time communication
// io.on("connection", (socket) => {
//   console.log("A user connected");

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });

//   // Handle incoming messages
//   socket.on("chat message", async (msg) => {
//     const message = new Message(msg);

//     try {
//       await message.save();
//       io.emit("chat message", message);
//     } catch (err) {
//       console.error("Error saving message:", err);
//     }
//   });
// });

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
    let data = await req.body.data;
    console.log(registrationToken, notification,data, "req");
    const message = {
      notification: notification,
      data: data,

      token: registrationToken,
      android: {
        priority: "high",
        notification: {
            sound: "default",
            default_vibrate_timings: false,
            vibrate_timings: ['0.1s', '0.5s', '0.1s', '0.5s'],
        },
        "ttl": 240000
    }
    };
    await admin
      .messaging()
      .send(message)
      .then((res) => {
        console.log(res, "res");
      });

    res.json({ message: "Notification sent successfully" });
  } catch (err) {
    console.log(err);
    res.json({ message: "Error sending notification" });
  }
});
app.post("/send_group_notification", async (req, res) => {
  try {
    let members = await req.body.members;
    let incomingData = await req.body.data;
    let creator = await req.body.user;
    let chatRoom = await req.body.chatRoom;

    let data = JSON.stringify({
      ...incomingData,
      ...creator,
      chatRoom:chatRoom,
    });
    console.log(data)
    members = members.filter(obj=>obj.phoneNumber !== creator.phoneNumber)
    // console.warn(creator, "creator");
    members.forEach(async (obj) => {
      let val = obj.contacts.find(
        (param) => param.phoneNumber === creator.phoneNumber
      );
      console.log(val, "val");
      let payload;
      if(val){
        payload = {
          token: obj.fcmToken,
          notification: {
            title: incomingData.title,
            body: `${val.name} : ${incomingData.body}`,
          },
          data: {chatRoomId:chatRoom},
          android: {
            priority: "high",
            notification: {
                sound: "default",
                default_vibrate_timings: false,
                vibrate_timings: ['0.1s', '0.5s', '0.1s', '0.5s'],
            },
            "ttl": 240000
        }
        };
      }else{
        payload = {
          token: obj.fcmToken,
          notification: {
            title: incomingData.title,
            body: `${creator.phoneNumber} : ${incomingData.body}`,
          },
        data: {chatRoomId:chatRoom},
          android: {
            priority: "high",
            notification: {
                sound: "default",
                default_vibrate_timings: false,
                vibrate_timings: ['0.1s', '0.5s', '0.1s', '0.5s'],
            },
            "ttl": 240000
        }
        };
      }
      await admin
        .messaging()
        .send(payload)
        .then((res) => {
          console.log(res, "res");
        });
    });

    res.json({ message: "Notification sent successfully" });
  } catch (err) {
    console.log(err);
    res.json({ message: "Error sending notification" });
  }
});
app.post("/login", LoginController);
