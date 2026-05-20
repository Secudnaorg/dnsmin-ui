import axios, {AxiosInstance} from "axios";
import {getConfig} from "@app/config";

let api: AxiosInstance | null = null;

export const getApi = (): AxiosInstance => {
    if (!api) {
        const config = getConfig();
        api = axios.create({
            baseURL: config.apiBaseUrl + '/v1',
            withCredentials: true,
            headers: config.tenantId ? {
                'X-Tenant-Id': config.tenantId,
            } : undefined,
        });
        api.interceptors.response.use(
            (res) => res,
            (err) => {
                console.error("API error:", err);
                return Promise.reject(err);
            }
        );
    }
    return api;
};
