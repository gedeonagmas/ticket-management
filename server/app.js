const express = require("express");
require("dotenv/config");
const path = require("path");
const cors = require("cors");
const { errorController } = require("./controller/errorController.js");
const { mongodb } = require("./config/db.js");
const { chatRouter, router } = require("./routes/router.js");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");

const app = express();
app.use(
  cors({
    origin: true,
    methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use("/ticket/app/v1/user", router);
app.use("/ticket/app/v1/chat", chatRouter);

app.get("/", (req, res) => {
  res.json("Hello from ticket server");
});

app.all("*", (req, res, next) => {
  res.status(200).json({ message: `${req.originalUrl} is Invalid url` });
  next();
});
app.use(errorController);
const videoUsers = {};

const socketToRoom = {};
mongodb()
  .then(() => {
    const httpServer = createServer(app);
    const io = new Server(httpServer, {
      cors: {
        origin: "*",
      },
    });

    //get online users
    let users = [];
    const addUser = (user, ids) => {
      if (users.length === 0) {
        users.push({ name: user, id: ids });
      } else {
        users.map((el) => {
          if (el.name === user) {
            el.id = ids;
          } else {
            users.push({ name: user, id: ids });
          }

          let duplicate = [];
          let isDuplicate = false;
          users = users.filter((el) => {
            isDuplicate = duplicate.includes(el.name);
            if (!isDuplicate) {
              duplicate.push(el.name);
              return true;
            } else {
              return false;
            }
          });
          return users;
        });
      }
    };

    const removeUser = (ids) => {
      users = users.filter((el) => el.id !== ids);

      let duplicate = [];
      let isDuplicate = false;
      users = users.filter((el) => {
        isDuplicate = duplicate.includes(el.name);
        if (!isDuplicate) {
          duplicate.push(el.name);
          return true;
        } else {
          return false;
        }
      });
      return users;
    };

    io.on("connection", (socket) => {
      //user connected
      socket.on("connect-user", (user) => {
        if (user !== "") {
          addUser(user, socket.id);
          io.emit(
            "aaa",
            users.map((u) => u.name)
          );
        }
      });

      //user disconnected
      socket.on("disconnect", () => {
        removeUser(socket.id);
        io.emit(
          "aaa",
          users.map((u) => u.name)
        );
      });

      //send message for rooms
      socket.on("aa", (messages, room) => {
        socket.join(room);
        socket.to(room).emit("bb", messages);
      });

      //typing indicator on
      socket.on("typing t", (bool, room) => {
        socket.join(room);
        socket.broadcast.to(room).emit("typing true", bool);
      });

      //typing indicator off
      socket.on("typing f", (bool, room) => {
        socket.join(room);
        socket.to(room).emit("typing false", bool);
      });

      socket.on("sen aaaa", (val) => {
        io.emit("rec aaaa", val);
      });

      socket.on("sen bbbb", (val) => {
        io.emit("rec bbbb", val);
      });

      socket.on("sen dddd", (val) => {
        io.emit("rec dddd", val);
      });

      socket.on("a1", (val) => {
        io.emit("a2", val);
      });

      socket.on("bb1", (val) => {
        io.emit("bb2", val);
      });

      socket.on("cc1", (val) => {
        io.emit("cc2", val);
      });

      socket.on("ff1", (val) => {
        io.emit("ff2", val);
      });

      socket.on("disconnect", () => {
        const roomID = socketToRoom[socket.id];
        let room = videoUsers[roomID];
        if (room) {
          room = room.filter((id) => id !== socket.id);
          videoUsers[roomID] = room;
        }
        socket.broadcast.emit("user left", socket.id);
      });
    });

    httpServer.listen(process.env.PORT, (err) => {
      if (err) {
        console.log("something went wrong server not connected");
      }
      console.log("server connected on port " + process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

// process.on("unhandledRejection", (err) => {
//   console.log("SHUTTING DOWN");
//   console.log(err.message, err.name);
//   server.close(() => {
//     process.exit(1);
//   });
// })
