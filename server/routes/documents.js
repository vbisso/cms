var express = require("express");
const sequenceGenerator = require("./sequenceGenerator");
const Document = require("../models/document");

var router = express.Router();

router.get("/", (req, res) => {
  Document.find()
    .then((documents) => {
      res.status(200).json(documents);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.post("/", (req, res) => {
  const maxId = sequenceGenerator.nextId("documents");
  const document = new Document({
    id: maxId,
    name: req.body.name,
    description: req.body.description,
    url: req.body.url,
  });
  document
    .save()
    .then((document) => {
      res.status(201).json({
        message: "Document added successfully",
        document: createdDocument,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "An error occurred", error: error });
    });
});
router.put("/:id", (req, res) => {
  Document.findOne({ id: req.params.id })
    .then((document) => {
      document.name = req.body.name;
      document.description = req.body.description;
      document.url = req.body.url;

      document
        .save()
        .then((document) => {
          res.status(204).json({ message: "Document updated successfully" });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ message: "An error occurred", error: error });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Document not found.",
        error: { document: "Document not found" },
      });
    });
});
router.delete("/:id", (req, res, next) => {
  Document.findOne({ id: req.params.id })
    .then((document) => {
      if (!document) {
        return res.status(500).json({
          message: "Document not found",
          error: { document: "Document not found" },
        });
      }

      Document.deleteOne({ id: req.params.id })
        .then((result) => {
          res.status(200).json({
            message: "Document deleted successfully",
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: "An error occurred",
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Document not found",
        error: { document: "Document not found" },
      });
    });
});
module.exports = router;
