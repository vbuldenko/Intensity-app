import { AxiosInstance } from "axios";
import { createClient } from "./index.js";

export const authClient: AxiosInstance = createClient();

authClient.interceptors.response.use((res) => res.data);
