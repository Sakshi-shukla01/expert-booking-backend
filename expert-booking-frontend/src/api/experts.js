import { api } from "./client";

export const fetchExperts = async ({ page, limit, search, category }) => {
  const params = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (search) params.search = search;
  if (category) params.category = category;

  const { data } = await api.get("/experts", { params });
  return data;
};

export const fetchExpertDetail = async (expertId) => {
  const { data } = await api.get(`/experts/${expertId}`);
  return data;
};