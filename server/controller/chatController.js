const asyncCatch = require("express-async-catch");
const AppError = require("../utils/AppError.js");
const { Chat } = require("../models/chatModel.js");
const { size } = require("../utils/size.js");
const api = `${process.env.API_URL}/uploads/`;

//create
const chatCreate = asyncCatch(async (req, res, next) => {
  let data;

  // console.log(req.files, "rrrrrr sssssss");
  let files = [];
  if (req.files && req.files?.chatFile) {
    req.files?.chatFile?.map((e) => files.push(api + e.filename));
  }
  const { sender, receiver } = req.body;
  const message =
    req.body.messageType === "text"
      ? { content: req.body.message }
      : req.body.messageType === "file"
      ? {
          content: req.files?.chatFile?.map((e) => {
            return {
              path: api + e.filename,
              mimetype: e.mimetype,
              size: size(e.size),
              originalname: e.originalname,
            };
          }),
          description: req.body.description,
        }
      : "";
  const chat = await Chat.findOne({ chatId: `${sender}.${receiver}` });
  if (chat) {
    data = await Chat.create({
      ...req.body,
      message,
      chatId: chat?.chatId,
    });
  } else {
    data = await Chat.create({
      ...req.body,
      message,
      chatId: `${receiver}.${sender}`,
    });
  }

  if (!data)
    return next(
      new AppError("something went wrong unable to send the message")
    );

  return res.status(201).json({
    // status: "Success",
    // message: "data created successfully",
    data,
  });
});

//read
const chatRead = asyncCatch(async (req, res, next) => {
  const { id } = req.params;
  const { limits } = req.query;
  const total = await Chat.countDocuments();
  const data = await Chat.find({
    $or: [
      { chatId: id },
      {
        chatId: id.split(".")[1] + "." + id.split(".")[0],
      },
    ],
  })
    .populate({
      path: "sender receiver",
    })
    .limit(limits ? limits : null);

  if (!data)
    return next(new AppError("something went wrong unable to fetch the data"));

  return res.status(201).json({
    status: "Success",
    message: "data fetched successfully",
    total,
    data,
  });
});

//update
const chatUpdate = asyncCatch(async (req, res, next) => {
  const data = await Chat.findOneAndUpdate(
    { _id: req.query.id },
    { ...req.body },
    { runValidators: true }
  );

  if (!data)
    return next(new AppError("something went wrong unable to update the data"));

  return res
    .status(201)
    .json({ status: "Success", message: "data updated successfully" });
});

//delete
const chatDelete = asyncCatch(async (req, res, next) => {
  const data = await Chat.findByIdAndUpdate(
    { _id: req.query.id },
    { deleted: req.body.type === "delete" ? true : false }
  );

  if (!data)
    return next(new AppError("something went wrong unable to delete the data"));

  return res
    .status(201)
    .json({ status: "Success", message: "data deleted successfully" });
});

module.exports = { chatCreate, chatRead, chatDelete, chatUpdate };
