// src/services/api.js - FIXED VERSION with proper export
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('healthping_token');
  }

  // Set authorization token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('healthping_token', token);
    } else {
      localStorage.removeItem('healthping_token');
    }
  }

  // Get authorization headers
  getAuthHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (includeAuth && this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    // Don't include auth header for login/register endpoints
    const isAuthEndpoint = endpoint.includes('/auth/login') || endpoint.includes('/auth/register');
    
    const config = {
      headers: this.getAuthHeaders(!isAuthEndpoint),
      ...options,
    };

    console.log('API Request:', {
      url,
      method: config.method || 'GET',
      headers: config.headers,
      body: config.body
    });

    try {
      const response = await fetch(url, config);
      
      console.log('API Response Status:', response.status);

      // Handle different response types
      if (response.status === 401 && !isAuthEndpoint) {
        // Only redirect to login for protected routes, not login itself
        this.setToken(null);
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
        }
        
        console.error('API Error Response:', errorData);
        throw new Error(errorData.error || errorData.message || `Request failed with status ${response.status}`);
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('API Response Data:', data);
        return data;
      }

      return { success: true };
    } catch (error) {
      console.error('API request failed:', error);
      
      // Network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      
      throw error;
    }
  }

  // Test connection method - FIXED
  async testConnection() {
    try {
      // Try multiple health check endpoints
      const healthUrls = [
        `${this.baseURL.replace('/api', '')}/health`,
        `${this.baseURL}/health`,
        `http://localhost:5000/health`,
        `http://localhost:5000/api/health`
      ];

      for (const url of healthUrls) {
        try {
          console.log(`Testing connection to: ${url}`);
          const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          
          if (response.ok) {
            console.log(`Connection successful to: ${url}`);
            return { success: true, message: 'Backend is running', url };
          }
        } catch (e) {
          console.log(`Failed to connect to: ${url}`, e.message);
          continue;
        }
      }
      
      throw new Error('Backend server is not running on any expected endpoint');
    } catch (error) {
      throw new Error(`Cannot connect to backend: ${error.message}`);
    }
  }

  // Authentication endpoints
  async login(email, password) {
    try {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      // Handle different response formats
      if (response.token) {
        this.setToken(response.token);
      } else if (response.data && response.data.token) {
        this.setToken(response.data.token);
      }
      
      return response;
    } catch (error) {
      // Don't redirect on login errors
      throw error;
    }
  }

  // Register function
  async register(userData) {
    console.log('ApiService: Real register called with:', userData);
    
    try {
      const response = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      console.log('ApiService: Real register response:', response);
      
      // Handle different response formats
      if (response.token) {
        this.setToken(response.token);
      } else if (response.data && response.data.token) {
        this.setToken(response.data.token);
      }
      
      return response;
    } catch (error) {
      console.error('ApiService: Real register error:', error);
      throw error;
    }
  }

  // Mock register for development
  async mockRegister(userData) {
    console.log('ApiService: Mock register called with:', userData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock user data
    const mockUser = {
      id: Date.now(),
      name: `${userData.firstName} ${userData.lastName}`,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role,
      phone: userData.phone,
      avatar: userData.role === 'doctor' ? '👨‍⚕️' : userData.role === 'nurse' ? '👩‍⚕️' : userData.role === 'admin' ? '👨‍💼' : '👤',
      specialization: userData.specialization || null,
      licenseNumber: userData.licenseNumber || null,
      isActive: true,
      emailVerified: true,
      whatsappOptIn: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const mockToken = 'mock-jwt-token-' + Date.now();
    this.setToken(mockToken);
    
    console.log('ApiService: Mock register returning:', { user: mockUser, token: mockToken });
    
    return {
      success: true,
      token: mockToken,
      user: mockUser,
      message: 'Registration successful (Demo Mode)'
    };
  }

  // Mock login for development
  async mockLogin(email, password) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data
    const mockUser = {
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: email,
      role: 'doctor',
      avatar: '👩‍⚕️'
    };
    
    const mockToken = 'mock-jwt-token-' + Date.now();
    this.setToken(mockToken);
    
    return {
      success: true,
      token: mockToken,
      user: mockUser
    };
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      // Ignore logout errors, just clear token
      console.warn('Logout request failed:', error);
    } finally {
      this.setToken(null);
    }
  }

  // Get current user
  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Update profile
  async updateProfile(userData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Forgot password
  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Reset password
  async resetPassword(token, newPassword) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password: newPassword }),
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

  // Send appointment reminder
  async sendAppointmentReminder(appointmentId) {
    return this.request(`/whatsapp/send-reminder/${appointmentId}`, {
      method: 'POST',
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

  async deletePatient(id) {
    return this.request(`/patients/${id}`, {
      method: 'DELETE',
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

  async updateDoctor(id, doctorData) {
    return this.request(`/doctors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(doctorData),
    });
  }

  async deleteDoctor(id) {
    return this.request(`/doctors/${id}`, {
      method: 'DELETE',
    });
  }

  // Messages
  async getMessageTemplates(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/messages/templates?${queryString}`);
  }

  async createMessageTemplate(templateData) {
    return this.request('/messages/templates', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
  }

  async updateMessageTemplate(id, templateData) {
    return this.request(`/messages/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(templateData),
    });
  }

  async deleteMessageTemplate(id) {
    return this.request(`/messages/templates/${id}`, {
      method: 'DELETE',
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

  async getResponseRates(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/analytics/response-rates?${queryString}`);
  }

  async getPatientEngagement(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/analytics/patient-engagement?${queryString}`);
  }

  // Settings
  async getSettings() {
    return this.request('/settings');
  }

  async updateSettings(settingsData) {
    return this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    });
  }

  async testWhatsAppConnection() {
    return this.request('/settings/test-whatsapp', {
      method: 'POST',
    });
  }
}

// FIXED: Proper export - Create instance and export as default
const apiService = new ApiService();
export default apiService;