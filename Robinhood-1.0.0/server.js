const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const moment = require("moment");

const app = express();
const port = 3000;

app.use(bodyParser.json());

// MongoDB Atlas connection (replace with your actual connection string)
mongoose.connect(
  "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Define Food model
const Food = mongoose.model("Food", {
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  location: { type: String, required: true },
  expiration_date: { type: Date, required: true },
  claimed: { type: Boolean, default: false },
});

// ... existing routes ...

app.post("/api/add-food", async (req, res) => {
  const { name, quantity, location, expiration_date } = req.body;

  if (!name || !quantity || !location || !expiration_date) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields" });
  }

  if (parseInt(quantity) <= 0) {
    return res
      .status(400)
      .json({ success: false, error: "Quantity must be a positive integer" });
  }

  const parsedDate = moment(expiration_date, "YYYY-MM-DDTHH:mm");
  if (!parsedDate.isValid()) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid date format" });
  }

  try {
    await Food.create({
      name,
      quantity: parseInt(quantity),
      location,
      expiration_date: parsedDate.toDate(),
    });
    res
      .status(201)
      .json({ success: true, message: "Food item added successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

app.delete("/user/cleanup-expired-food", async (req, res) => {
  const today = new Date();
  try {
    const result = await Food.deleteMany({ expiration_date: { $lte: today } });
    if (result.deletedCount > 0) {
      res.json({
        success: true,
        message: `Deleted ${result.deletedCount} expired food items.`,
      });
    } else {
      res.json({ success: true, message: "No expired food items found." });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

app.post("/user/api/claim-food/:foodId", async (req, res) => {
  const foodId = req.params.foodId;
  try {
    const foodItem = await Food.findById(foodId);
    if (!foodItem) {
      return res
        .status(404)
        .json({ success: false, message: "Food item not found." });
    }
    if (foodItem.claimed) {
      return res
        .status(400)
        .json({ success: false, message: "Food item already claimed." });
    }
    foodItem.claimed = true;
    await foodItem.save();
    res.json({ success: true, message: "Food item claimed successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// ... existing code ...

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
