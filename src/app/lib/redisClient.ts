import { createClient } from "redis";
import config from "../config";




export const redisClient = createClient({
    username: config.redist_user,
    password: config.redist_password,
    socket: {
        host: config.redist_host,
        port: Number(config.redist_port)
    },

})