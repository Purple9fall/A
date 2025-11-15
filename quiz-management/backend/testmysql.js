const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Dhon17@14duyhoang",
  database: "quiz_app"
});

db.connect(err => {
  if (err) {
    console.error("❌ Không kết nối được MySQL:", err.message);
  } else {
    console.log("✅ Kết nối MySQL thành công!");
  }
  db.end();
});
