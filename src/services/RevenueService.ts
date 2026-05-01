import { MonthlyRevenue } from "@/entities/MonthlyRevenue";
import APICLIENT from "./ApiClient";

export default new APICLIENT<unknown, MonthlyRevenue>("/revenue/monthly");