import pg from "../server/node_modules/pg/lib/index.js";

const dbUrl = process.env.DB_URL || "postgresql://postgres.kflocdxfthkzghxazfsl:$%40%21yun84260@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";

const pool = new pg.Pool({
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

const updateToAdmin = async () => {
  try {
    // admin 아이디를 관리자로 변경
    const result = await pool.query(`
      UPDATE users 
      SET is_admin = true 
      WHERE user_id = 'admin'
      RETURNING user_id, user_nick, email;
    `);

    if (result.rows.length > 0) {
      console.log("기존 admin 계정을 관리자로 변경 완료:", result.rows[0]);
    } else {
      console.log("admin 계정을 찾을 수 없습니다.");
    }
    
    process.exit(0);
  } catch (err) {
    console.error("관리자 권한 부여 실패", err);
    process.exit(1);
  }
};

updateToAdmin();
