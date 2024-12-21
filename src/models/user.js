const mongoose = require("mongoose");
const bcrypte = require("bcryptjs");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    FirstName: {
      type: String,
      required: true,
    },
    LastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);
// userSchema.methods.comparePassword = async function (password) {
//   const result = await bcrypte.compareSync(password, this.password);
//   return result;
// };

const User = mongoose.model("User", userSchema);

module.exports = User;
