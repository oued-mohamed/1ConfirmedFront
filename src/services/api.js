// src/services/api.js - FINAL VERSION with complete error handling
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// DEVELOPMENT MODE FLAG - Set this to true if you want to skip all API calls and use mock data
const DEVELOPMENT_MODE = false;

// Track known endpoints that don't exist in the backend yet
const unavailableEndpoints = [
  '/messages/templates',
  '/messages/history',
  '/whatsapp/send',
  '/settings/test-whatsapp'
];

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

  // Check if an endpoint is available or should be mocked
  shouldUseMockData(endpoint) {
    if (DEVELOPMENT_MODE) return true;
    
    // Check if this endpoint is in our list of known unavailable endpoints
    return unavailableEndpoints.some(unavailableEndpoint => 
      endpoint.includes(unavailableEndpoint)
    );
  }

  async request(endpoint, options = {}) {
    // Check if we should use mock data for this endpoint
    if (this.shouldUseMockData(endpoint)) {
      console.log(`Using mock data for endpoint: ${endpoint}`);
      throw new Error('Using mock data');
    }

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
        // If we get a 404, add this endpoint to our list of unavailable endpoints
        if (response.status === 404) {
          const unavailableEndpoint = endpoint.split('?')[0]; // Remove query params
          if (!unavailableEndpoints.includes(unavailableEndpoint)) {
            unavailableEndpoints.push(unavailableEndpoint);
            console.log(`Added endpoint to unavailable list: ${unavailableEndpoint}`);
          }
        }
        
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
    if (DEVELOPMENT_MODE) {
      console.log('Development mode: Skipping connection test');
      return { success: true, message: 'Development mode active', mock: true };
    }
    
    try {
      // Try multiple health check endpoints
     const healthUrls = [
  `${this.baseURL}/health`  // This will be: http://localhost:5000/api/health
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
    if (this.shouldUseMockData('/auth/login')) {
      return this.mockLogin(email, password);
    }
    
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
      // For network errors or if we're using mock data
      if (error.message === 'Using mock data' || error.message.includes('Network error')) {
        console.log('Using mock login');
        return this.mockLogin(email, password);
      }
      
      // Don't redirect on login errors
      throw error;
    }
  }

  // Register function
  async register(userData) {
    if (this.shouldUseMockData('/auth/register')) {
      return this.mockRegister(userData);
    }
    
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
      
      // For network errors or if we're using mock data
      if (error.message === 'Using mock data' || error.message.includes('Network error')) {
        console.log('Using mock register');
        return this.mockRegister(userData);
      }
      
      throw error;
    }
  }

  // Mock register for development
  async mockRegister(userData) {
    console.log('ApiService: Mock register called with:', userData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
    console.log('ApiService: Mock login called with:', email);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
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
      user: mockUser,
      message: 'Login successful (Demo Mode)'
    };
  }

  async logout() {
    try {
      if (!this.shouldUseMockData('/auth/logout')) {
        await this.request('/auth/logout', { method: 'POST' });
      } else {
        console.log('Mock logout');
      }
    } catch (error) {
      // Ignore logout errors, just clear token
      console.warn('Logout request failed:', error);
    } finally {
      this.setToken(null);
    }
  }

  // Get current user
  async getCurrentUser() {
    if (this.shouldUseMockData('/auth/me')) {
      console.log('Mock get current user');
      return { 
        id: 1, 
        name: 'Dr. Sarah Johnson',
        email: 'sarah@example.com',
        role: 'doctor',
        avatar: '👩‍⚕️'
      };
    }
    return this.request('/auth/me');
  }

  // Update profile
  async updateProfile(userData) {
    if (this.shouldUseMockData('/auth/profile')) {
      console.log('Mock profile update:', userData);
      return { success: true, message: 'Profile updated (Demo Mode)' };
    }
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Forgot password
  async forgotPassword(email) {
    if (this.shouldUseMockData('/auth/forgot-password')) {
      console.log('Mock forgot password for:', email);
      return { success: true, message: 'Reset link sent (Demo Mode)' };
    }
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Reset password
  async resetPassword(token, newPassword) {
    if (this.shouldUseMockData('/auth/reset-password')) {
      console.log('Mock reset password with token:', token);
      return { success: true, message: 'Password reset successful (Demo Mode)' };
    }
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password: newPassword }),
    });
  }

  // Appointments
  async getAppointments(params = {}) {
    if (this.shouldUseMockData('/appointments')) {
      console.log('Mock get appointments');
      return { 
        data: [
          {
            id: 1,
            patient: 'John Smith',
            phone: '+1234567890',
            doctor: 'Dr. Johnson',
            department: 'Cardiology',
            date: '2024-01-15',
            time: '09:00',
            status: 'confirmed',
            whatsappSent: true
          },
          {
            id: 2,
            patient: 'Sarah Wilson',
            phone: '+1234567891',
            doctor: 'Dr. Brown',
            department: 'Dermatology',
            date: '2024-01-15',
            time: '10:30',
            status: 'pending',
            whatsappSent: false
          },
          {
            id: 3,
            patient: 'Mike Davis',
            phone: '+1234567892',
            doctor: 'Dr. Lee',
            department: 'Orthopedics',
            date: '2024-01-16',
            time: '14:00',
            status: 'confirmed',
            whatsappSent: true
          }
        ]
      };
    }
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/appointments?${queryString}`);
  }

  async createAppointment(appointmentData) {
    if (this.shouldUseMockData('/appointments')) {
      console.log('Mock create appointment:', appointmentData);
      return { 
        success: true, 
        data: {
          id: Date.now(),
          ...appointmentData,
          status: 'pending',
          createdAt: new Date().toISOString()
        },
        message: 'Appointment created (Demo Mode)' 
      };
    }
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  async updateAppointment(id, appointmentData) {
    if (this.shouldUseMockData('/appointments')) {
      console.log('Mock update appointment:', id, appointmentData);
      return { 
        success: true, 
        data: {
          id,
          ...appointmentData,
          updatedAt: new Date().toISOString()
        },
        message: 'Appointment updated (Demo Mode)' 
      };
    }
    return this.request(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData),
    });
  }

  async deleteAppointment(id) {
    if (this.shouldUseMockData('/appointments')) {
      console.log('Mock delete appointment:', id);
      return { success: true, message: 'Appointment deleted (Demo Mode)' };
    }
    return this.request(`/appointments/${id}`, {
      method: 'DELETE',
    });
  }

  // Send appointment reminder
  async sendAppointmentReminder(appointmentId) {
    if (this.shouldUseMockData('/whatsapp/send-reminder')) {
      console.log('Mock send reminder for appointment:', appointmentId);
      return { success: true, message: 'Reminder sent (Demo Mode)' };
    }
    return this.request(`/whatsapp/send-reminder/${appointmentId}`, {
      method: 'POST',
    });
  }

  // Patients
  async getPatients(params = {}) {
    if (this.shouldUseMockData('/patients')) {
      console.log('Mock get patients');
      return { 
        data: [
          {
            id: 1,
            name: 'John Smith',
            phone: '+1234567890',
            email: 'john@email.com',
            dateOfBirth: '1985-03-15',
            gender: 'Male',
            lastVisit: '2024-01-10',
            whatsappOptIn: true
          },
          {
            id: 2,
            name: 'Sarah Wilson',
            phone: '+1234567891',
            email: 'sarah@email.com',
            dateOfBirth: '1990-07-22',
            gender: 'Female',
            lastVisit: '2024-01-08',
            whatsappOptIn: true
          },
          {
            id: 3,
            name: 'Mike Davis',
            phone: '+1234567892',
            email: 'mike@email.com',
            dateOfBirth: '1978-11-03',
            gender: 'Male',
            lastVisit: '2024-01-05',
            whatsappOptIn: false
          }
        ]
      };
    }
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/patients?${queryString}`);
  }

  async createPatient(patientData) {
    if (this.shouldUseMockData('/patients')) {
      console.log('Mock create patient:', patientData);
      return { 
        success: true, 
        data: {
          id: Date.now(),
          ...patientData,
          createdAt: new Date().toISOString()
        },
        message: 'Patient created (Demo Mode)' 
      };
    }
    return this.request('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  }

  async updatePatient(id, patientData) {
    if (this.shouldUseMockData('/patients')) {
      console.log('Mock update patient:', id, patientData);
      return { 
        success: true, 
        data: {
          id,
          ...patientData,
          updatedAt: new Date().toISOString()
        },
        message: 'Patient updated (Demo Mode)' 
      };
    }
    return this.request(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patientData),
    });
  }

  async deletePatient(id) {
    if (this.shouldUseMockData('/patients')) {
      console.log('Mock delete patient:', id);
      return { success: true, message: 'Patient deleted (Demo Mode)' };
    }
    return this.request(`/patients/${id}`, {
      method: 'DELETE',
    });
  }

  // Doctors
  async getDoctors(params = {}) {
    if (this.shouldUseMockData('/doctors')) {
      console.log('Mock get doctors');
      return { 
        data: [
          {
            id: 1,
            name: 'Dr. Sarah Johnson',
            specialization: 'Cardiology',
            department: 'Cardiology',
            phone: '+1234567890',
            email: 'sarah.johnson@hospital.com',
            workingHours: '9:00 AM - 5:00 PM',
            status: 'active'
          },
          {
            id: 2,
            name: 'Dr. Michael Brown',
            specialization: 'Dermatology',
            department: 'Dermatology',
            phone: '+1234567891',
            email: 'michael.brown@hospital.com',
            workingHours: '10:00 AM - 6:00 PM',
            status: 'active'
          },
          {
            id: 3,
            name: 'Dr. Emily Lee',
            specialization: 'Orthopedics',
            department: 'Orthopedics',
            phone: '+1234567892',
            email: 'emily.lee@hospital.com',
            workingHours: '8:00 AM - 4:00 PM',
            status: 'on_leave'
          }
        ]
      };
    }
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/doctors?${queryString}`);
  }

  async createDoctor(doctorData) {
    if (this.shouldUseMockData('/doctors')) {
      console.log('Mock create doctor:', doctorData);
      return { 
        success: true, 
        data: {
          id: Date.now(),
          ...doctorData,
          createdAt: new Date().toISOString()
        },
        message: 'Doctor created (Demo Mode)' 
      };
    }
    return this.request('/doctors', {
      method: 'POST',
      body: JSON.stringify(doctorData),
    });
  }

  async updateDoctor(id, doctorData) {
    if (this.shouldUseMockData('/doctors')) {
      console.log('Mock update doctor:', id, doctorData);
      return { 
        success: true, 
        data: {
          id,
          ...doctorData,
          updatedAt: new Date().toISOString()
        },
        message: 'Doctor updated (Demo Mode)' 
      };
    }
    return this.request(`/doctors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(doctorData),
    });
  }

  async deleteDoctor(id) {
    if (this.shouldUseMockData('/doctors')) {
      console.log('Mock delete doctor:', id);
      return { success: true, message: 'Doctor deleted (Demo Mode)' };
    }
    return this.request(`/doctors/${id}`, {
      method: 'DELETE',
    });
  }

  // Messages
  async getMessageTemplates(params = {}) {
    if (this.shouldUseMockData('/messages/templates')) {
      console.log('Mock get message templates');
      return { 
        data: [
          {
            id: 1,
            name: 'Appointment Reminder',
            category: 'Reminder',
            content: 'Hi {{patient_name}}, this is a reminder about your appointment with {{doctor_name}} on {{date}} at {{time}}. Please confirm by replying YES.',
            variables: ['patient_name', 'doctor_name', 'date', 'time'],
            status: 'active',
            lastUsed: '2024-01-15',
            usageCount: 156,
            responseRate: '94%'
          },
          {
            id: 2,
            name: 'Appointment Confirmation',
            category: 'Confirmation',
            content: 'Dear {{patient_name}}, your appointment with {{doctor_name}} has been confirmed for {{date}} at {{time}}. Location: {{location}}',
            variables: ['patient_name', 'doctor_name', 'date', 'time', 'location'],
            status: 'active',
            lastUsed: '2024-01-14',
            usageCount: 89,
            responseRate: '98%'
          },
          {
            id: 3,
            name: 'Cancellation Notice',
            category: 'Cancellation',
            content: 'Hi {{patient_name}}, we regret to inform you that your appointment on {{date}} has been cancelled. Please call us to reschedule.',
            variables: ['patient_name', 'date'],
            status: 'draft',
            lastUsed: '2024-01-10',
            usageCount: 23,
            responseRate: '76%'
          },
          {
            id: 4,
            name: 'Follow-up Reminder',
            category: 'Follow-up',
            content: 'Hello {{patient_name}}, Dr. {{doctor_name}} recommends a follow-up appointment. Please call us at {{phone}} to schedule.',
            variables: ['patient_name', 'doctor_name', 'phone'],
            status: 'active',
            lastUsed: '2024-01-12',
            usageCount: 67,
            responseRate: '85%'
          },
          {
            id: 5,
            name: 'Prescription Ready',
            category: 'Notification',
            content: 'Your prescription is ready for pickup at {{pharmacy_name}}. Pickup hours: {{hours}}. Questions? Call {{phone}}.',
            variables: ['pharmacy_name', 'hours', 'phone'],
            status: 'active',
            lastUsed: '2024-01-13',
            usageCount: 134,
            responseRate: '92%'
          },
          {
            id: 6,
            name: 'Test Results Available',
            category: 'Notification',
            content: 'Hi {{patient_name}}, your test results are now available. Please log into your patient portal or call us at {{phone}}.',
            variables: ['patient_name', 'phone'],
            status: 'active',
            lastUsed: '2024-01-11',
            usageCount: 45,
            responseRate: '88%'
          }
        ]
      };
    }
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/messages/templates?${queryString}`);
  }

  async createMessageTemplate(templateData) {
    if (this.shouldUseMockData('/messages/templates')) {
      console.log('Mock create message template:', templateData);
      await new Promise(resolve => setTimeout(resolve, 500)); // Add a small delay for realism
      
      return { 
        success: true, 
        data: {
          id: Date.now(),
          name: templateData.name,
          category: templateData.category,
          content: templateData.content,
          variables: templateData.variables || [],
          status: 'active',
          lastUsed: new Date().toISOString().split('T')[0],
          usageCount: 0,
          responseRate: '0%',
          createdAt: new Date().toISOString()
        },
        message: 'Template created successfully (Demo Mode)' 
      };
    }
    return this.request('/messages/templates', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
  }

  async updateMessageTemplate(id, templateData) {
    if (this.shouldUseMockData('/messages/templates')) {
      console.log('Mock update message template:', id, templateData);
      return { 
        success: true, 
        data: {
          id,
          ...templateData,
          updatedAt: new Date().toISOString()
        },
        message: 'Template updated (Demo Mode)' 
      };
    }
    return this.request(`/messages/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(templateData),
    });
  }

  async deleteMessageTemplate(id) {
    if (this.shouldUseMockData('/messages/templates')) {
      console.log('Mock delete message template:', id);
      return { success: true, message: 'Template deleted (Demo Mode)' };
    }
    return this.request(`/messages/templates/${id}`, {
      method: 'DELETE',
    });
  }

  async sendWhatsAppMessage(messageData) {
    if (this.shouldUseMockData('/whatsapp/send')) {
      console.log('Mock send WhatsApp message:', messageData);
      return { success: true, message: 'Message sent (Demo Mode)' };
    }
    return this.request('/whatsapp/send', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async getMessageHistory(params = {}) {
    if (this.shouldUseMockData('/messages/history')) {
      console.log('Mock get message history');
      return { 
        data: [
          {
            id: 1,
            patient: 'John Smith',
            phone: '+1234567890',
            template: 'Appointment Reminder',
            content: 'Hi John Smith, this is a reminder about your appointment with Dr. Johnson...',
            sentAt: '2024-01-15 09:00:00',
            status: 'delivered',
            response: 'YES',
            responseAt: '2024-01-15 09:15:00'
          },
          {
            id: 2,
            patient: 'Sarah Wilson',
            phone: '+1234567891',
            template: 'Appointment Confirmation',
            content: 'Dear Sarah Wilson, your appointment with Dr. Brown has been confirmed...',
            sentAt: '2024-01-15 08:30:00',
            status: 'read',
            response: null,
            responseAt: null
          },
          {
            id: 3,
            patient: 'Mike Davis',
            phone: '+1234567892',
            template: 'Appointment Reminder',
            content: 'Hi Mike Davis, this is a reminder about your appointment...',
            sentAt: '2024-01-14 16:00:00',
            status: 'failed',
            response: null,
            responseAt: null
          }
        ]
      };
    }
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/messages/history?${queryString}`);
  }

  // Analytics
  async getDashboardStats() {
    if (this.shouldUseMockData('/analytics/dashboard')) {
      console.log('Mock get dashboard stats');
      return { 
        totalPatients: 124,
        totalAppointments: 56,
        upcomingAppointments: 12,
        messagesSent: 245,
        messageDeliveryRate: '98%',
        responseRate: '76%'
      };
    }
    return this.request('/analytics/dashboard');
  }

  async getAppointmentStats(params = {}) {
    if (this.shouldUseMockData('/analytics/appointments')) {
      console.log('Mock get appointment stats');
      return { 
        data: [
          { date: '2024-01-10', count: 12 },
          { date: '2024-01-11', count: 8 },
          { date: '2024-01-12', count: 15 },
          { date: '2024-01-13', count: 10 },
          { date: '2024-01-14', count: 6 },
          { date: '2024-01-15', count: 14 }
        ]
      };
    }
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/analytics/appointments?${queryString}`);
  }

  async getResponseRates(params = {}) {
    if (this.shouldUseMockData('/analytics/response-rates')) {
      console.log('Mock get response rates');
      return { 
        data: [
          { template: 'Appointment Reminder', responseRate: 94, usageCount: 156 },
          { template: 'Appointment Confirmation', responseRate: 98, usageCount: 89 },
          { template: 'Cancellation Notice', responseRate: 76, usageCount: 23 },
          { template: 'Follow-up Reminder', responseRate: 85, usageCount: 67 },
          { template: 'Prescription Ready', responseRate: 92, usageCount: 134 },
          { template: 'Test Results Available', responseRate: 88, usageCount: 45 }
        ]
      };
    }
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/analytics/response-rates?${queryString}`);
  }

  async getPatientEngagement(params = {}) {
    if (this.shouldUseMockData('/analytics/patient-engagement')) {
      console.log('Mock get patient engagement');
      return { 
        data: [
          { date: '2024-01-10', messagesSent: 23, responses: 18 },
          { date: '2024-01-11', messagesSent: 15, responses: 12 },
          { date: '2024-01-12', messagesSent: 28, responses: 22 },
          { date: '2024-01-13', messagesSent: 19, responses: 15 },
          { date: '2024-01-14', messagesSent: 12, responses: 9 },
          { date: '2024-01-15', messagesSent: 25, responses: 20 }
        ]
      };
    }
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/analytics/patient-engagement?${queryString}`);
  }

  // Settings
  async getSettings() {
    if (this.shouldUseMockData('/settings')) {
      console.log('Mock get settings');
      return {
        hospitalName: 'HealthPing General Hospital',
        hospitalEmail: 'admin@healthping.com',
        hospitalPhone: '+1234567890',
        whatsappApiKey: '',
        whatsappApiSecret: '',
        reminderTiming: { first: 24, second: 12 },
        emailNotifications: true,
        smsBackup: true,
        autoConfirmation: true
      };
    }
    return this.request('/settings');
  }

  async updateSettings(settingsData) {
    if (this.shouldUseMockData('/settings')) {
      console.log('Mock update settings:', settingsData);
      return { 
        success: true, 
        data: settingsData,
        message: 'Settings updated (Demo Mode)' 
      };
    }
    return this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    });
  }

  async testWhatsAppConnection() {
    if (this.shouldUseMockData('/settings/test-whatsapp')) {
      console.log('Mock test WhatsApp connection');
      // Simulate a delay before responding
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, message: 'WhatsApp connection successful (Demo Mode)' };
    }
    return this.request('/settings/test-whatsapp', {
      method: 'POST',
    });
  }
}

// Create instance and export as default
const apiService = new ApiService();
export default apiService;