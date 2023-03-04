const express = require("express");
const router = express.Router();
const Event = require("../models/events");
const multer = require("multer");
const fs = require("fs");

//image upload
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
}).single("image");

//Insert an event into database route
router.post("/event", upload, (req, res) => {
  const event = new Event({
    name: req.body.name,
    desc: req.body.desc,
    type: req.body.type,
    days: req.body.days,
    subEvents: req.body.subEvents,
    date: req.body.date,
    time: req.body.time,
    venue: req.body.venue,
    price: req.body.price,
    clg: req.body.clg,
    comm: req.body.comm,
    image: req.file.filename,
  });
  event.save((err) => {
    if (err) {
      res.json({ message: err.message, type: "danger" });
    } else {
      req.session.message = {
        type: "success",
        message: "Event added successfully",
      };
      res.redirect("/list");
    }
  });
});

router.get("/list", (req, res) => {
  Event.find().exec((err, events) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.render("list", {
        title: "Events",
        events: events,
      });
    }
  });
});

// Home page event
router.get("/", (req, res) => {
  Event.find().exec((err, events) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.render("home", {
        title: "Events",
        events: events,
      });
    }
  });
});

router.get("/eventView", (req, res) => {
  Event.find().exec((err, events) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.render("eventView", {
        title: "Events",
        events: events,
      });
    }
  });
});

router.get("/about", (req, res) => {
  res.render("about", {});
});

router.get("/contact", (req, res) => {
  res.render("contact", {});
});

router.get("/forgotPassword", (req, res) => {
  res.render("forgotPassword", {});
});

router.get("/login", (req, res) => {
  res.render("login", {});
});

router.get("/register", (req, res) => {
  res.render("register", {});
});

// router.get("/users", (req, res) => {
//   res.send("users");
// });

//Edit an event
router.get("/edit/:id", (req, res) => {
  let id = req.params.id;
  Event.findById(id, (err, event) => {
    if (err) {
      res.redirect("/home");
    } else {
      if (event == null) {
        res.redirect("/home");
      } else {
        res.render("edit", { title: "Edit Event", event: event });
      }
    }
  });
});

//Update Event
router.post("/edit/:id", upload, (req, res) => {
  let id = req.params.id;
  let new_image = "";
  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync("./uploads/" + req.body.old_image);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body.old_image;
  }
  Event.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      desc: req.body.desc,
      type: req.body.type,
      days: req.body.days,
      subEvents: req.body.subEvents,
      date: req.body.date,
      time: req.body.time,
      venue: req.body.venue,
      price: req.body.price,
      clg: req.body.clg,
      comm: req.body.comm,
      image: new_image,
    },
    (err, result) => {
      if (err) {
        res.json({ message: err.message, type: "danger" });
      } else {
        req.session.message = {
          type: "success",
          message: "Event updated successfully",
        };
        res.redirect("/list");
      }
    }
  );
});

//Delete event
router.get("/delete/:id", (req, res) => {
  let id = req.params.id;
  Event.findByIdAndRemove(id, (err, result) => {
    if (result.image != "") {
      try {
        fs.unlinkSync("./uploads/" + result.image);
      } catch (err) {
        console.log(err);
      }
    }
    if (err) {
      res.json({ message: err.message, type: "danger" });
    } else {
      req.session.message = {
        type: "info",
        message: "Event deleted successfully",
      };
      res.redirect("/list");
    }
  });
});

module.exports = router;