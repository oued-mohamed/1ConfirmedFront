// src/services/api.js 

// Determine API URL based on environment
const getApiUrl = () => {
  // If running on localhost (development)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  
  // If deployed (production) - use Railway backend
  return 'https://1confirmedbackend-production.up.railway.app/api';
};

const API_BASE_URL = getApiUrl();

// Always use real backend now that we have it deployed
const DEVELOPMENT_MODE = false;

console.log('API Service Configuration:');
console.log('- Current hostname:', window.location.hostname);
console.log('- API Base URL:', API_BASE_URL);
console.log('- Development Mode:', DEVELOPMENT_MODE);

// Track known endpoints that don't exist in the backend yet
const unavailableEndpoints = [
  '/whatsapp/send',
  '/settings/test-whatsapp'
  // REMOVED: '/messages/templates', '/messages/history', '/doctors', '/appointments'
  // These now have real endpoints!
];

// Endpoints that should ALWAYS use real API (never mock)
const forceRealEndpoints = [
  '/patients',
  '/auth',           // FIXED - Force real API for ALL auth endpoints
  '/doctors',        
  '/appointments',   
  '/messages',       
  '/analytics'       
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
    
    // NEVER use mock data for forced real endpoints
    const isForceReal = forceRealEndpoints.some(realEndpoint => 
      endpoint.includes(realEndpoint)
    );
    if (isForceReal) {
      console.log(`Forcing real API for endpoint: ${endpoint}`);
      return false;
    }
    
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
        // DON'T add forced real endpoints to unavailable list even if they fail
        const isForceReal = forceRealEndpoints.some(realEndpoint => 
          endpoint.includes(realEndpoint)
        );
        
        if (response.status === 404 && !isForceReal) {
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

  // Test connection method
  async testConnection() {
    if (DEVELOPMENT_MODE) {
      console.log('Development mode: Skipping connection test');
      return { success: true, message: 'Development mode active', mock: true };
    }
    
    try {
      // Use the correct health endpoint for our environment
      const url = `${this.baseURL}/health`;
      
      console.log(`Testing connection to: ${url}`);
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`Connection successful to: ${url}`);
        console.log('Backend response:', data);
        return { success: true, message: 'Backend is running', url, data };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      throw new Error(`Cannot connect to backend: ${error.message}`);
    }
  }

  // Authentication endpoints - FIXED to always use real API
  async login(email, password) {
    console.log('ApiService: Real login called with:', email);
    
    try {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      console.log('ApiService: Real login response:', response);
      
      // Handle different response formats
      if (response.token) {
        this.setToken(response.token);
      } else if (response.data && response.data.token) {
        this.setToken(response.data.token);
      }
      
      return response;
    } catch (error) {
      console.error('ApiService: Real login error:', error);
      
      // For network errors, fallback to mock only if endpoint is truly unavailable
      if (error.message.includes('Network error') || error.message.includes('fetch')) {
        console.log('Network error detected, falling back to mock login');
        return this.mockLogin(email, password);
      }
      
      // Don't use mock for other errors (like invalid credentials)
      throw error;
    }
  }

  // Register function - FIXED to always use real API first
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
      
      // For network errors, fallback to mock only if endpoint is truly unavailable
      if (error.message.includes('Network error') || error.message.includes('fetch')) {
        console.log('Network error detected, falling back to mock register');
        return this.mockRegister(userData);
      }
      
      // Don't use mock for other errors (like user already exists)
      throw error;
    }
  }

  // Mock register for development/fallback only
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

  // ✅ FIXED: Mock login with proper credential validation
async mockLogin(email, password) {
  console.log('ApiService: Mock login called with:', email);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // ✅ VALID CREDENTIALS LIST
  const validCredentials = [
    { 
      email: 'admin@healthping.com', 
      password: 'admin123',
      user: {
        id: 1,
        name: 'Dr. Admin Johnson',
        email: 'admin@healthping.com',
        role: 'admin',
        avatar: '👨‍💼'
      }
    },
    { 
      email: 'demo@healthping.com', 
      password: 'demo123',
      user: {
        id: 2,
        name: 'Dr. Sarah Johnson',
        email: 'demo@healthping.com',
        role: 'doctor',
        avatar: '👩‍⚕️'
      }
    },
    { 
      email: 'doctor@healthping.com', 
      password: 'doctor123',
      user: {
        id: 3,
        name: 'Dr. Mike Wilson',
        email: 'doctor@healthping.com',
        role: 'doctor',
        avatar: '👨‍⚕️'
      }
    },
    { 
      email: 'nurse@healthping.com', 
      password: 'nurse123',
      user: {
        id: 4,
        name: 'Nurse Emma Davis',
        email: 'nurse@healthping.com',
        role: 'nurse',
        avatar: '👩‍⚕️'
      }
    }
  ];
  
  // ✅ VALIDATE CREDENTIALS
  const validUser = validCredentials.find(
    cred => cred.email === email && cred.password === password
  );
  
  // ✅ THROW ERROR IF INVALID CREDENTIALS
  if (!validUser) {
    console.log('Mock login failed: Invalid credentials for', email);
    throw new Error('Invalid email or password');
  }
  
  // ✅ ONLY RETURN SUCCESS FOR VALID CREDENTIALS
  const mockToken = 'mock-jwt-token-' + Date.now();
  this.setToken(mockToken);
  
  console.log('Mock login successful for:', validUser.user.name);
  
  return {
    success: true,
    token: mockToken,
    user: validUser.user,
    message: 'Login successful (Demo Mode)'
  };
}

  async logout() {
    try {
      // Always try real API first for logout
      await this.request('/auth/logout', { method: 'POST' });
      console.log('Real logout successful');
    } catch (error) {
      // Ignore logout errors, just clear token
      console.warn('Logout request failed (this is normal):', error.message);
    } finally {
      this.setToken(null);
    }
  }

  // Get current user - FIXED to always use real API
  async getCurrentUser() {
    try {
      return await this.request('/auth/me');
    } catch (error) {
      console.error('Get current user failed:', error);
      // If token is invalid, clear it
      if (error.message.includes('Invalid or expired token')) {
        this.setToken(null);
      }
      throw error;
    }
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

  // Appointments - NOW USING REAL API
  async getAppointments(params = {}) {
    console.log('Getting appointments from real API');
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/appointments?${queryString}`);
  }

  async createAppointment(appointmentData) {
    console.log('Creating appointment with real API:', appointmentData);
    
    // Transform the data to match backend expectations
    const transformedData = {
      patient: appointmentData.patientName || appointmentData.patient,  // Map patientName to patient
      phone: appointmentData.phone,
      doctor: appointmentData.doctor,
      department: appointmentData.department,
      date: appointmentData.date,
      time: appointmentData.time,
      status: appointmentData.status || 'pending'
    };
    
    console.log('Transformed appointment data:', transformedData);
    
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(transformedData),
    });
  }

  async updateAppointment(id, appointmentData) {
    console.log('Updating appointment with real API:', id, appointmentData);
    
    // Transform the data to match backend expectations
    const transformedData = {
      patient: appointmentData.patientName || appointmentData.patient,  // Map patientName to patient
      phone: appointmentData.phone,
      doctor: appointmentData.doctor,
      department: appointmentData.department,
      date: appointmentData.date,
      time: appointmentData.time,
      status: appointmentData.status || 'pending'
    };
    
    console.log('Transformed appointment update data:', transformedData);
    
    return this.request(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transformedData),
    });
  }

  async deleteAppointment(id) {
    console.log('Deleting appointment with real API:', id);
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

  // Patients - NOW USING REAL API
  async getPatients(params = {}) {
    console.log('Getting patients from real API');
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/patients?${queryString}`);
  }

  async createPatient(patientData) {
    console.log('Creating patient with real API:', patientData);
    return this.request('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  }

  async updatePatient(id, patientData) {
    console.log('Updating patient with real API:', id, patientData);
    return this.request(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patientData),
    });
  }

  async deletePatient(id) {
    console.log('Deleting patient with real API:', id);
    return this.request(`/patients/${id}`, {
      method: 'DELETE',
    });
  }

  // Doctors - UPDATED FOR BETTER COMPATIBILITY
  async getDoctors(params = {}) {
    console.log('Getting doctors from real API');
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/doctors?${queryString}`);
  }

  // UPDATED: Enhanced createDoctor method with better data transformation
  async createDoctor(doctorData) {
    console.log('Creating doctor with real API:', doctorData);
    
    // Transform the data to ensure compatibility with backend
    // The backend now accepts both formats, but let's be explicit
    const transformedData = {
      // If we have firstName and lastName, combine them into name
      ...(doctorData.firstName && doctorData.lastName ? {
        name: `${doctorData.firstName} ${doctorData.lastName}`,
        firstName: doctorData.firstName,
        lastName: doctorData.lastName
      } : {
        name: doctorData.name
      }),
      specialization: doctorData.specialization,
      department: doctorData.department,
      phone: doctorData.phone,
      email: doctorData.email || '',
      licenseNumber: doctorData.licenseNumber || '',
      workingHours: doctorData.workingHours || '',
      notes: doctorData.notes || '',
      status: doctorData.status || 'active'
    };
    
    console.log('Transformed doctor data:', transformedData);
    
    return this.request('/doctors', {
      method: 'POST',
      body: JSON.stringify(transformedData),
    });
  }

  // UPDATED: Enhanced updateDoctor method with better data transformation
  async updateDoctor(id, doctorData) {
    console.log('Updating doctor with real API:', id, doctorData);
    
    // Transform the data to ensure compatibility with backend
    const transformedData = {
      // If we have firstName and lastName, combine them into name
      ...(doctorData.firstName && doctorData.lastName ? {
        name: `${doctorData.firstName} ${doctorData.lastName}`,
        firstName: doctorData.firstName,
        lastName: doctorData.lastName
      } : doctorData.name ? {
        name: doctorData.name
      } : {}),
      ...(doctorData.specialization && { specialization: doctorData.specialization }),
      ...(doctorData.department && { department: doctorData.department }),
      ...(doctorData.phone && { phone: doctorData.phone }),
      ...(doctorData.email !== undefined && { email: doctorData.email }),
      ...(doctorData.licenseNumber !== undefined && { licenseNumber: doctorData.licenseNumber }),
      ...(doctorData.workingHours !== undefined && { workingHours: doctorData.workingHours }),
      ...(doctorData.notes !== undefined && { notes: doctorData.notes }),
      ...(doctorData.status && { status: doctorData.status })
    };
    
    console.log('Transformed doctor update data:', transformedData);
    
    return this.request(`/doctors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transformedData),
    });
  }

  async deleteDoctor(id) {
    console.log('Deleting doctor with real API:', id);
    return this.request(`/doctors/${id}`, {
      method: 'DELETE',
    });
  }

  // Messages - NOW USING REAL API
  async getMessageTemplates(params = {}) {
    console.log('Getting message templates from real API');
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/messages/templates?${queryString}`);
  }

  async createMessageTemplate(templateData) {
    console.log('Creating message template with real API:', templateData);
    return this.request('/messages/templates', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
  }

  async updateMessageTemplate(id, templateData) {
    console.log('Updating message template with real API:', id, templateData);
    return this.request(`/messages/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(templateData),
    });
  }

  async deleteMessageTemplate(id) {
    console.log('Deleting message template with real API:', id);
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
    console.log('Getting message history from real API');
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/messages/history?${queryString}`);
  }

  // Analytics - NOW USING REAL API
  async getDashboardStats() {
    console.log('Getting dashboard stats from real API');
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