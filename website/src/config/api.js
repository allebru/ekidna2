// API Configuration for Website (Public subscription form)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Submit subscription form
export const submitSubscription = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Submission failed');
    }

    return data;
  } catch (error) {
    console.error('Subscription error:', error);
    throw error;
  }
};

// Health check
export const checkAPIHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

export default {
  submitSubscription,
  checkAPIHealth,
};
