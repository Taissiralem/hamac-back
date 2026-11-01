// Crée (ou réinitialise le mot de passe d') un compte administrateur.
// Usage : node src/scripts/create-admin.js email@exemple.com "MotDePasse" [Prénom] [Nom]
require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/user");

(async () => {
  const [email, password, FirstName = "Admin", LastName = "Hamac"] = process.argv.slice(2);
  if (!email || !password || password.length < 8) {
    console.error("Usage : node src/scripts/create-admin.js <email> <mot de passe (8+ caractères)>");
    process.exit(1);
  }
  const con = await connectDB();
  const hashed = bcrypt.hashSync(password, 10);
  const user = await User.findOneAndUpdate(
    { email },
    { $set: { password: hashed }, $setOnInsert: { FirstName, LastName, email } },
    { upsert: true, new: true }
  );
  console.log(`Admin prêt : ${user.email}`);
  await con.disconnect();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
