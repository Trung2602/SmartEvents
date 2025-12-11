import { Event } from "../types";
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
        const res = await apiClient.get<Event>('/event/${id}')
        return res.data
    },
    async create(event: Event) {

    },
    async edit(event: Event) {
        
    },
    async register(id: string) {

    },
    async unregister(id: string) {

    },

}