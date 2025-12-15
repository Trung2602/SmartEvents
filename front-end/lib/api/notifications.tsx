import { apiClient } from "./clients";
import type { AxiosRequestConfig } from "axios";
import { fetchEventSource } from "@microsoft/fetch-event-source";

export type NotificationType =
    | "EVENT_REGISTERED"
    | "EVENT_CREATED"
    | string;

export interface NotificationDto {
    id?: string;
    uuid?: string;
    userUuid?: string;
    eventUuid?: string;
    type: NotificationType;
    title: string;
    message: string;
    imageUrl?: string;
    linkUrl?: string;
    createdAt?: string;
    read?: boolean;
    readAt?: string | null;
}

export interface PageResponse<T> {
    content: T[];
    totalElements?: number;
    totalPages?: number;
    number?: number;
    size?: number;
}

export interface ListNotificationsParams {
    page?: number;
    size?: number;
    sort?: string;
    read?: boolean;
    type?: string;
}

/**
 * - GET    /notifications
 * - PATCH  /notifications/{id}/read
 * - PATCH  /notifications/read-all
 */

export const notificationsApi = {

    list: async (
        params: ListNotificationsParams = {},
        config?: AxiosRequestConfig
    ) => {
        const res = await apiClient.get<PageResponse<NotificationDto>>(
            "/notifications",
            { params, ...config }
        );
        return res.data;
    },

    markAsRead: async (id: string, config?: AxiosRequestConfig) => {
        const res = await apiClient.patch<NotificationDto>(
            `/notifications/${id}/read`,
            null,
            config
        );
        return res.data;
    },

    markAllAsRead: async (config?: AxiosRequestConfig) => {
        const res = await apiClient.patch<{ updated: number }>(
            "/notifications/read-all",
            null,
            config
        );
        return res.data;
    },

};

export function connect() {
    const controller = new AbortController();
    fetchEventSource("http://localhost:8081/api/v1/notifications/stream", {
        signal: controller.signal,
        headers: {
            "X-USER-UUID": "11111111-1111-1111-1111-111111111111",
        },
        onmessage(msg) {
            console.log(JSON.parse(msg.data));

            // if (msg.event === "ping") {
            //     console.log(JSON.parse(msg.data));
            // }
        },
    });

    controller.abort();
}
