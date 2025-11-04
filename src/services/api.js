import axios from "axios";

// Create API instance
const api = axios.create({
  baseURL: "https://winchelmohandes-furniture.online/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userType");
      // Redirect to login page
      window.location.href = "/login/company";
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  loginCompany: async (credentials) => {
    const response = await api.post("/auth/company/login", credentials);
    return response.data;
  },

  loginAdmin: async (credentials) => {
    const response = await api.post("/auth/admin/login", credentials);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  changePassword: async (data) => {
    const response = await api.put("/auth/change-password", data);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },
};

// Public services
export const publicService = {
  getCompanies: async (params) => {
    const response = await api.get("/public/companies", { params });
    return response.data;
  },

  getCompanyDetails: async (id) => {
    const response = await api.get(`/public/companies/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get("/public/categories");
    return response.data;
  },

  getWebsiteStats: async () => {
    const response = await api.get("/public/stats");
    return response.data;
  },
};

// Company services
export const companyService = {
  getProfile: async () => {
    const response = await api.get("/companies/profile");
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put("/companies/profile", data);
    return response.data;
  },

  uploadLogo: async (file) => {
    const formData = new FormData();
    formData.append("logo", file);

    const response = await api.put("/companies/logo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  uploadImages: async (files) => {
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    const response = await api.post("/companies/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteImage: async (id) => {
    const response = await api.delete(`/companies/images/${id}`);
    return response.data;
  },

  uploadVideos: async (files) => {
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("videos", files[i]);
    }

    const response = await api.post("/companies/videos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteVideo: async (id) => {
    const response = await api.delete(`/companies/videos/${id}`);
    return response.data;
  },

  addPhoneNumber: async (number) => {
    const response = await api.post("/companies/phones", { number });
    return response.data;
  },

  deletePhoneNumber: async (id) => {
    const response = await api.delete(`/companies/phones/${id}`);
    return response.data;
  },

  addWhatsAppNumber: async (number) => {
    const response = await api.post("/companies/whatsapp", { number });
    return response.data;
  },

  deleteWhatsAppNumber: async (id) => {
    const response = await api.delete(`/companies/whatsapp/${id}`);
    return response.data;
  },

  addService: async (service_name) => {
    const response = await api.post("/companies/services", { service_name });
    return response.data;
  },

  updateService: async (id, service_name) => {
    const response = await api.put(`/companies/services/${id}`, {
      service_name,
    });
    return response.data;
  },

  deleteService: async (id) => {
    const response = await api.delete(`/companies/services/${id}`);
    return response.data;
  },

  getPricingPlans: async () => {
    const response = await api.get("/companies/pricing-plans");
    return response.data;
  },

  addPricingPlan: async (data) => {
    const response = await api.post("/companies/pricing-plans", data);
    return response.data;
  },

  updatePricingPlan: async (id, data) => {
    const response = await api.put(`/companies/pricing-plans/${id}`, data);
    return response.data;
  },

  deletePricingPlan: async (id) => {
    const response = await api.delete(`/companies/pricing-plans/${id}`);
    return response.data;
  },

  updateCategories: async (categoryIds) => {
    const response = await api.put("/companies/categories", {
      category_ids: categoryIds,
    });
    return response.data;
  },
};

// Blog services
export const blogService = {
  getBlogPosts: async (params) => {
    const response = await api.get("/blog", { params });
    return response.data;
  },

  getBlogPost: async (id) => {
    const response = await api.get(`/blog/${id}`);
    return response.data;
  },
};

// Review services
export const reviewService = {
  getCompanyReviews: async (companyId, params) => {
    const response = await api.get(`/reviews/company/${companyId}`, { params });
    return response.data;
  },

  addReview: async (companyId, data) => {
    const response = await api.post(`/reviews/company/${companyId}`, data);
    return response.data;
  },
};

// Comments services
export const commentsService = {
  getPostComments: async (idOrSlug, params) => {
    const response = await api.get(`/comments/post/${idOrSlug}`, { params });
    return response.data;
  },

  addComment: async (idOrSlug, data) => {
    const response = await api.post(`/comments/post/${idOrSlug}`, data);
    return response.data;
  },

  // Admin
  getPostCommentsAdmin: async (idOrSlug, params) => {
    const response = await api.get(`/comments/admin/post/${idOrSlug}`, {
      params,
    });
    return response.data;
  },
  approveComment: async (commentId) => {
    const response = await api.put(`/comments/${commentId}/approve`);
    return response.data;
  },
  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },
};

// Contact services
export const contactService = {
  submitContactForm: async (data) => {
    const response = await api.post("/contact", data);
    return response.data;
  },
};

// Admin services
export const adminService = {
  getAllCompanies: async (params) => {
    const response = await api.get("/admin/companies", { params });
    return response.data;
  },

  getCompany: async (id) => {
    const response = await api.get(`/admin/companies/${id}`);
    return response.data;
  },

  createCompany: async (data) => {
    const response = await api.post("/admin/companies", data);
    return response.data;
  },

  updateCompany: async (id, data) => {
    const response = await api.put(`/admin/companies/${id}`, data);
    return response.data;
  },

  deleteCompany: async (id) => {
    const response = await api.delete(`/admin/companies/${id}`);
    return response.data;
  },

  resetCompanyPassword: async (id, newPassword) => {
    const response = await api.put(`/admin/companies/${id}/reset-password`, {
      newPassword,
    });
    return response.data;
  },

  getAllReviews: async (params) => {
    const response = await api.get("/reviews", { params });
    return response.data;
  },

  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },

  createBlogPost: async (data, image) => {
    const formData = new FormData();

    // Append blog post data
    formData.append("title", data.title);
    formData.append("content", data.content);
    if (data.author) formData.append("author", data.author);
    if (data.slug) formData.append("slug", data.slug);
    if (data.excerpt) formData.append("excerpt", data.excerpt);
    if (data.category) formData.append("category", data.category);
    if (Array.isArray(data.tags))
      formData.append("tags", JSON.stringify(data.tags));
    if (data.status) formData.append("status", data.status);
    if (data.published_at) formData.append("published_at", data.published_at);

    // Append image if provided
    if (image) {
      formData.append("image", image);
    }

    const response = await api.post("/blog", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateBlogPost: async (id, data, image) => {
    const formData = new FormData();

    // Append blog post data
    formData.append("title", data.title);
    formData.append("content", data.content);
    if (data.author !== undefined) formData.append("author", data.author ?? "");
    if (data.slug !== undefined) formData.append("slug", data.slug ?? "");
    if (data.excerpt !== undefined)
      formData.append("excerpt", data.excerpt ?? "");
    if (data.category !== undefined)
      formData.append("category", data.category ?? "");
    if (data.tags !== undefined) {
      formData.append(
        "tags",
        Array.isArray(data.tags) ? JSON.stringify(data.tags) : data.tags ?? ""
      );
    }
    if (data.status !== undefined) formData.append("status", data.status ?? "");
    if (data.published_at !== undefined)
      formData.append("published_at", data.published_at ?? "");

    // Append image if provided
    if (image) {
      formData.append("image", image);
    }

    const response = await api.put(`/blog/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteBlogPost: async (id) => {
    const response = await api.delete(`/blog/${id}`);
    return response.data;
  },

  getContactMessages: async (params) => {
    const response = await api.get("/contact", { params });
    return response.data;
  },

  getContactMessage: async (id) => {
    const response = await api.get(`/contact/${id}`);
    return response.data;
  },

  deleteContactMessage: async (id) => {
    const response = await api.delete(`/contact/${id}`);
    return response.data;
  },

  markMessageAsRead: async (id) => {
    const response = await api.put(`/contact/${id}/read`);
    return response.data;
  },

  // Categories (Admin)
  createCategory: async (data) => {
    const response = await api.post("/admin/categories", data);
    return response.data;
  },
  updateCategory: async (id, data) => {
    const response = await api.put(`/admin/categories/${id}`, data);
    return response.data;
  },
  deleteCategory: async (id) => {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },
};

export default api;
