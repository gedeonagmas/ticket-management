const asyncCatch = require("express-async-catch");
const AppError = require("../utils/AppError");
const { selectModel } = require("../utils/selectModel");
const bwipjs = require("bwip-js");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");

const api = `${process.env.API_URL}/uploads/`;

const generateQrBarCode = async (ticketId) => {
  const uploadsDir = path.join(__dirname, "./../uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const ticketUrl = `${process.env.FRONT_URL}/ticket?ticketId=${ticketId}`;
  const barcodePath = path.join(uploadsDir, `barcodes-${ticketId}.png`);
  const qrCodePath = path.join(uploadsDir, `qrcodes-${ticketId}.png`);

  console.log("Saving barcode at:", barcodePath);
  console.log("Saving QR code at:", qrCodePath);

  // Generate Barcode
  await bwipjs
    .toBuffer({
      bcid: "code128",
      text: ticketId,
      scale: 3,
      height: 10,
      includetext: false,
      textxalign: "center",
    })
    .then(async (png) => {
      await fs.promises.writeFile(barcodePath, png);
      console.log("Barcode saved successfully");
    })
    .catch((err) => {
      throw new AppError("Barcode generation failed: " + err.message, 500);
    });

  // Generate QR Code
  await QRCode.toFile(qrCodePath, ticketUrl)
    .then(() => console.log("QR Code saved successfully"))
    .catch((err) => {
      throw new AppError("QR Code generation failed: " + err.message, 500);
    });
};

//create
const _create = asyncCatch(async (req, res, next) => {
  const model = selectModel(req.params.table, next);

  if (!model) {
    return next(new AppError("Invalid table specified", 400));
  }

  try {
    const count = (await model.countDocuments()) + 1;
    const datePart = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const ticketId = `TICKET-${datePart}-${count.toString().padStart(3, "0")}`;

    generateQrBarCode(ticketId);

    // Save to Database
    const data = await model.create({
      ...req.body,
      ticketId: req.params.table === "tickets" ? ticketId : undefined,
      barcode:
        req.params.table === "tickets"
          ? `${api}barcodes-${ticketId}.png`
          : undefined,
      qrCode:
        req.params.table === "tickets"
          ? `${api}qrcodes-${ticketId}.png`
          : undefined,
      profilePicture: req.files?.profilePicture?.[0]?.filename
        ? `${api}/${req.files.profilePicture[0].filename}`
        : undefined,
    });

    res.status(201).json({
      status: "Success",
      message: "Data created successfully",
      data,
    });
  } catch (error) {
    console.error("Error in _create:", error);
    next(error);
  }
});

//read
const _read = asyncCatch(async (req, res, next) => {
  const model = selectModel(req.params.table, next);

  if (model) {
    const params = { ...req.query };
    //removing unnecessary queries for advanced fetching
    const remove = [
      "sort",
      "page",
      "limit",
      "fields",
      "limits",
      "searchField",
      "searchValue",
      "populate",
    ];
    remove.forEach((el) => delete params[el]);

    //filtering
    let queryObject = JSON.parse(
      JSON.stringify(params).replace(
        /\b(gte|lte|lt|gt|eq|ne|or)\b/g,
        (match) => `$${match}`
      )
    );

    //searching
    if (req.query.searchField)
      queryObject[req.query.searchField] = new RegExp(
        req.query.searchValue,
        "gi"
      );

    //sorting
    const query = model.find({ ...queryObject });

    req.query.sort
      ? query.sort(req.query.sort.split(",").join(" "))
      : query.sort("-createdAt");

    //limiting fields
    const fields = req.query.fields
      ? req.query.fields.split(",").join(" ")
      : "-_v";
    query.select(fields);

    //pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || null;
    const skip = (page - 1) * limit;
    query.skip(skip).limit(limit);

    console.log(req.query);
    //populating
    query?.populate(req?.query?.populate?.split(",").join(" "));

    req.query.limits ? query.limit(req.query.limits) : null;

    const total = model.countDocuments({ ...queryObject });
    const data = await Promise.all([total, query]);

    return res.status(200).json({
      status: "success",
      length: data.length,
      total: data[0],
      data: data[1],
    });
  }
  return next(new AppError("something went wrong please try again!!", 500));
});

//update
const _update = asyncCatch(async (req, res, next) => {
  const model = selectModel(req.params.table, next);

  //remove persistent data from being updated
  const remove = ["password", "role"];
  remove.forEach((el) => delete req.params[el]);

  console.log(model, req.params);
  if (model) {
    const data = await model.findOneAndUpdate(
      { _id: req.query.id },
      {
        ...req.body,
        profilePicture: req.files?.profilePicture
          ? api + req.files.profilePicture[0]?.filename
          : undefined,
      },
      { runValidators: true, new: true }
    );

    if (!data)
      return next(
        new AppError("something went wrong unable to update the data")
      );

    return res
      .status(201)
      .json({ status: "Success", message: "data updated successfully", data });
  }
  return next(new AppError("something went wrong please try again!!", 500));
});

//delete
const _delete = asyncCatch(async (req, res, next) => {
  const model = selectModel(req.params.table, next);

  if (model) {
    const data = await model.findByIdAndDelete(req.query.id);

    if (!data)
      return next(
        new AppError("something went wrong unable to delete the data")
      );

    return res
      .status(201)
      .json({ status: "Success", message: "data deleted successfully" });
  }
  return next(new AppError("something went wrong please try again!!", 500));
});

module.exports = { _create, _read, _update, _delete };
