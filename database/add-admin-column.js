import pg from "../server/node_modules/pg/lib/index.js";

const dbUrl = process.env.DB_URL || "postgresql://postgres.kflocdxfthkzghxazfsl:$%40%21yun84260@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";

const pool = new pg.Pool({
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

const addAdminColumn = async () => {
  try {
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;
    `);
    console.log("is_admin 컬럼 추가 완료");
    process.exit(0);
  } catch (err) {
    console.error("컬럼 추가 실패", err);
    process.exit(1);
  }
};

addAdminColumn();
