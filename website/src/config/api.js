// API Configuration for Website (Public subscription form)

// Default to a same-origin relative path: in produzione le chiamate /api
// vengono inoltrate al backend Node dal reverse-proxy (.htaccess).
// In sviluppo, il proxy di Vite (vite.config) gira /api su localhost:3001.
// Si può comunque forzare un URL assoluto con VITE_API_BASE_URL.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

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
