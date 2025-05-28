import axios from 'axios';

// Set base URL for API calls
const baseURL = import.meta.env.VITE_ORION_URL || 'http://localhost:1026';

// Headers required for FIWARE Orion Context Broker
const headers = {
  'Content-Type': 'application/json',
  'fiware-service': 'airport',
  'fiware-servicepath': '/'
};

// Create axios instance
const api = axios.create({
  baseURL,
  headers
});

// API functions for flights
export const flightAPI = {
  getAllFlights: async () => {
    try {
      const response = await api.get('/v2/entities', {
        params: {
          type: 'Flight'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching flights:', error);
      throw error;
    }
  },

  getFlightById: async (id: string) => {
    try {
      const response = await api.get(`/v2/entities/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching flight ${id}:`, error);
      throw error;
    }
  }
};

// API functions for weather conditions
export const weatherAPI = {
  getWeatherConditions: async () => {
    try {
      const response = await api.get('/v2/entities', {
        params: {
          type: 'WeatherCondition'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching weather conditions:', error);
      throw error;
    }
  }
};

// API functions for runway status
export const runwayAPI = {
  getAllRunways: async () => {
    try {
      const response = await api.get('/v2/entities', {
        params: {
          type: 'RunwayStatus'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching runways:', error);
      throw error;
    }
  },

  getRunwayById: async (id: string) => {
    try {
      const response = await api.get(`/v2/entities/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching runway ${id}:`, error);
      throw error;
    }
  }
};

// API function to get historical data from QuantumLeap
export const historyAPI = {
  getEntityHistory: async (entityId: string, entityType: string, attrs: string[], dateFrom: string, dateTo: string) => {
    try {
      const quantumLeapURL = import.meta.env.VITE_QUANTUMLEAP_URL || 'http://localhost:8668';
      
      const response = await axios.get(`${quantumLeapURL}/v2/entities/${entityId}/attrs/${attrs.join(',')}`, {
        params: {
          type: entityType,
          fromDate: dateFrom,
          toDate: dateTo
        },
        headers
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching history for ${entityId}:`, error);
      throw error;
    }
  }
};

export default {
  flightAPI,
  weatherAPI,
  runwayAPI,
  historyAPI
};