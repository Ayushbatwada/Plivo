import axios from 'axios';

const apiConn = axios.create({ baseURL: 'http://localhost:6000/v1/api' });

export const fetchServices = () => apiConn.get('/services/get/all');
export const createService = (service) => apiConn.post('/services/create/new', service);
export const updateService = (id, updates) => apiConn.patch(`/services/update`, updates);

export const fetchIncidents = () => apiConn.get('/incidents/get/all');
export const createIncident = (incident) => apiConn.post('/incidents/create', incident);
export const resolveIncident = (id, updates) => apiConn.patch(`/incidents/update`, updates);
