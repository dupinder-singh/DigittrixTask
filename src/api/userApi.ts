import { UserResponse } from "../dataModel/userResponse";
import apiClient from "./client";

export const fetchUsers = async (page: number): Promise<UserResponse> => {
    const response = await apiClient.get(`/users?page=${page}`);
    return response.data;
}