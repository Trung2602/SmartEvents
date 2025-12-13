import { Event, Review } from "../types";
import { apiClient } from "./clients";

export type GetEventResponse = {
    items: Event[], 
    nextCursor: string | null,
    hasNext: boolean
};

export const eventApi = {
    async list(): Promise<GetEventResponse> {
        const res = await apiClient.get<GetEventResponse>('/events');
        return res.data;
    },
    async get(id: string): Promise<Event> {
        const res = await apiClient.get<Event>(`/event/${id}`);
        return res.data;
    },
    async create(event: Event) {
        const res = await apiClient.post('/event/create', event);
        return res.data;
    },
    async edit(event: Event) {
        const res = await apiClient.post('/event/edit', event);
        return res.data;
    },
    async register(id: string) {
        const res = await apiClient.get<Event>(`/event/register/${id}`)
        return res.data
    },
    async unregister(id: string) {
        const res = await apiClient.get<Event>(`/event/unregister/${id}`)
        return res.data
    },
    async interest(id: string) {
        const res = await apiClient.get<Event>(`/event/interest/${id}`)
        return res.data
    },
    async uninterest(id: string) {
        const res = await apiClient.get<Event>(`/event/uninterest/${id}`)
        return res.data
    },
    async rating(id: string, data: Review) {
        const res = await apiClient.post(`/event/rating/${id}`, data)
        return res.data
    },
    async delete(id: string) {
        const res = await apiClient.get(`/event/delete/${id}`)
        return res.data
    },
    async hide(id: string) {
        const res = await apiClient.get(`/event/hide/${id}`)
        return res.data
    },
}