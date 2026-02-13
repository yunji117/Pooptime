import bcrypt from "../server/node_modules/bcryptjs/index.js";
import pg from "../server/node_modules/pg/lib/index.js";

const dbUrl = process.env.DB_URL || "postgresql://postgres.kflocdxfthkzghxazfsl:$%40%21yun84260@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";

const pool = new pg.Pool({
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

const adminUserId = process.env.ADMIN_USER_ID || "admin";
const adminPassword = process.env.ADMIN_PASSWORD || "Admin!1234";
const adminEmail = process.env.ADMIN_EMAIL || "admin@pooptime.com";
const adminNick = process.env.ADMIN_NICK || "관리자";

const seedAdmin = async () => {
	try {
		const existing = await pool.query("SELECT id FROM users WHERE user_id = $1", [adminUserId]);
		if (existing.rows.length > 0) {
			console.log("관리자 계정이 이미 존재합니다.");
			process.exit(0);
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(adminPassword, salt);

		await pool.query(
			"INSERT INTO users (user_id, password, email, user_nick, is_admin) VALUES ($1, $2, $3, $4, true)",
			[adminUserId, hashedPassword, adminEmail, adminNick]
		);

		console.log("관리자 계정 생성 완료:", adminUserId);
		process.exit(0);
	} catch (err) {
		console.error("관리자 계정 생성 실패", err);
		process.exit(1);
	}
};

seedAdmin();
