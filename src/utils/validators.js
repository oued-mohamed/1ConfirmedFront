// src/utils/validators.js
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateWhatsAppNumber = (phone) => {
  // WhatsApp numbers should start with country code
  const whatsappRegex = /^\+[1-9]\d{1,14}$/;
  return whatsappRegex.test(phone);
};

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

export const validateDate = (date) => {
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate >= today;
};

export const validateTime = (time) => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

