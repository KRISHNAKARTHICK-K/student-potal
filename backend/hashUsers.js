const bcrypt = require("bcrypt");
const db = require("./config/db");

async function hashPasswords() {
  db.query("SELECT id, password FROM users", async (err, users) => {
    if (err) {
      console.error(err);
      return;
    }

    for (const user of users) {
      if (!user.password.startsWith("$2b$")) {
        const hashed = await bcrypt.hash(user.password, 10);

        db.query(
          "UPDATE users SET password = ? WHERE id = ?",
          [hashed, user.id],
          (err2) => {
            if (err2) console.error(err2);
            else console.log(`Updated user ${user.id}`);
          }
        );
      }
    }
  });
}

hashPasswords();
