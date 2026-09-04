/** biome-ignore-all lint/style/noNonNullAssertion: <explanation> */
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
	node_env: process.env.NODE_ENV,
	port: process.env.PORT,
	database_url: process.env.DATABASE_URL,
	bak_url: process.env.APP_URL,
	frontend_url: process.env.FRONTEND_URL,
	bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
	jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
	jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
	jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN!,
	jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN!,
	google_client_id: process.env.GOOGLE_CLIENT_ID!,
	supper_admin_name: process.env.SUPPER_ADMIN_NAME!,
	supper_admin_email: process.env.SUPPER_ADMIN_EMAIL!,
	supper_admin_password: process.env.SUPPER_ADMIN_PASSWORD!,
	test_admin_name: process.env.TEST_ADMIN_NAME!,
	test_admin_email: process.env.TEST_ADMIN_EMAIL!,
	test_admin_password: process.env.TEST_ADMIN_PASSWORD!,
	test_doctor_name: process.env.TEST_DOCTOR_PASSWORD!,
	test_doctor_email: process.env.TEST_DOCTOR_EMAIL!,
	test_doctor_password: process.env.TEST_DOCTOR_PASSWORD!,
	redist_user: process.env.REDIS_USER!,
	redist_password: process.env.REDIS_PASSWORD!,
	redist_host: process.env.REDIS_HOST!,
	redist_port: process.env.REDIS_PORT!,
	smtp_user: process.env.SMTP_USER!,
	smtp_password: process.env.SMTP_PASSWORD!,
	smtp_sender: process.env.EMAIL_SENDER!,
	cloudinary_name: process.env.CLOUDINARY_CLOUD_NAME!,
	cloudinary_api_key: process.env.CLOUDINARY_API_KEY!,
	cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET!,
};
