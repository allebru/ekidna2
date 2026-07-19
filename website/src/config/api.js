const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const submitSubscription = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/subscribers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.status === 409) {
      return { success: false, errorCode: 'DUPLICATE_EMAIL' };
    }

    if (!response.ok) {
      return { success: false, errorCode: 'SERVER_ERROR' };
    }

    return data;
  } catch {
    return { success: false, errorCode: 'NETWORK_ERROR' };
  }
};

export const checkAPIHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
};

export default { submitSubscription, checkAPIHealth };
