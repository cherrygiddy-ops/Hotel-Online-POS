import { AdminStats } from "@/entities/AdminStats";
import APICLIENT from "./ApiClient";

export default new APICLIENT<unknown,AdminStats>("/admin/stats");