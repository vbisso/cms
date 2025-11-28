var express = require("express");
const sequenceGenerator = require("./sequenceGenerator");
const Message = require("../models/message");

var router = express.Router();

router.get("/", (req, res) => {
  Message.find()
    .then((messages) => {
      res.status(200).json(messages);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.post("/", (req, res) => {
  const maxId = sequenceGenerator.nextId("messages");
  const message = new Message({
    id: maxId,
    subject: req.body.subject,
    msgText: req.body.msgText,
    sender: req.body.sender,
  });
  message
    .save()
    .then((message) => {
      res.status(201).json({
        message: "Message added successfully",
        msg: message,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "An error occurred", error: error });
    });
});

// router.put("/:id", (req, res) => {
//   Message.findOne({ id: req.params.id })
//     .then((message) => {
//       message.subject = req.body.subject;
//       message.msgText = req.body.msgText;
//       message.sender = req.body.sender;

//       message
//         .save()
//         .then((message) => {
//           res.status(204).json({ message: "Message updated successfully" });
//         })
//         .catch((err) => {
//           console.log(err);
//           res.status(500).json({ message: "An error occurred", error: error });
//         });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({
//         message: "Message not found.",
//         error: { message: "Message not found" },
//       });
//     });
// });

// router.delete("/:id", (req, res, next) => {
//   Message.findOne({ id: req.params.id })
//     .then((message) => {
//       if (!message) {
//         return res.status(500).json({
//           message: "Message not found",
//           error: { message: "Message not found" },
//         });
//       }

//       Message.deleteOne({ id: req.params.id })
//         .then((result) => {
//           res.status(200).json({
//             message: "Message deleted successfully",
//           });
//         })
//         .catch((error) => {
//           res.status(500).json({
//             message: "An error occurred",
//             error: error,
//           });
//         });
//     })
//     .catch((error) => {
//       res.status(500).json({
//         message: "Message not found",
//         error: { message: "Message not found" },
//       });
//     });
// });

module.exports = router;
