// src/utils/formatters.js
export const formatPatientName = (firstName, lastName) => {
  return `${firstName} ${lastName}`.trim();
};

export const formatDoctorName = (name) => {
  if (name.startsWith('Dr.')) return name;
  return `Dr. ${name}`;
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digits except the leading +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Format based on length
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  
  return `+${cleaned}`;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

