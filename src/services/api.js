// src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('healthping_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Appointments
  async getAppointments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/appointments?${queryString}`);
  }

  async createAppointment(appointmentData) {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  async updateAppointment(id, appointmentData) {
    return this.request(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData),
    });
  }

  async deleteAppointment(id) {
    return this.request(`/appointments/${id}`, {
      method: 'DELETE',
    });
  }

  // Patients
  async getPatients(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/patients?${queryString}`);
  }

  async createPatient(patientData) {
    return this.request('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  }

  async updatePatient(id, patientData) {
    return this.request(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patientData),
    });
  }

  // Doctors
  async getDoctors(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/doctors?${queryString}`);
  }

  async createDoctor(doctorData) {
    return this.request('/doctors', {
      method: 'POST',
      body: JSON.stringify(doctorData),
    });
  }

  // Messages
  async getMessageTemplates() {
    return this.request('/messages/templates');
  }

  async createMessageTemplate(templateData) {
    return this.request('/messages/templates', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
  }

  async sendWhatsAppMessage(messageData) {
    return this.request('/whatsapp/send', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async getMessageHistory(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/messages/history?${queryString}`);
  }

  // Analytics
  async getDashboardStats() {
    return this.request('/analytics/dashboard');
  }

  async getAppointmentStats(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/analytics/appointments?${queryString}`);
  }
}

export default new ApiService();

