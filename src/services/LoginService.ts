import type { LoginPayload } from "../entities/LoginPayload";
import type LoginResponse from "../entities/LoginResponse";
import APICLIENT from "./ApiClient";


export default new APICLIENT<LoginPayload,LoginResponse>("/auth");
