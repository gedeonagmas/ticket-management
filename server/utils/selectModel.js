const { User } = require("../models/userModel");
const AppError = require("./AppError");
const { Ticket } = require("../models/ticketModel");

const selectModel = (name, next) => {
  let model;
  switch (name) {
    case "users":
      model = User;
      break;
    case "tickets":
      model = Ticket;
      break;
    default:
      return next(
        new AppError("Something went wrong please try again!!!", 500)
      );
  }
  return model;
};

module.exports = { selectModel };
