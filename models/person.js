const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);
mongoose
  .connect(url)

  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    required: true,
    minlength: 8, // rule 1: length ≥ 8
    validate: {
      // rule 2: exactly two parts: 2–3 digits, hyphen, then digits
      validator: (v) => /^\d{2,3}-\d+$/.test(v),
      message: (props) =>
        `${props.value} is not a valid phone number. Use NN-NNN… or NNN-NNN… (min length 8).`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
