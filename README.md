# Backend ReadMe

This README provides detailed instructions and information about the backend of the Status Page application. Follow the steps below to set up and run the backend server.

## **Features**

- **Services Management**: CRUD operations for services, including status updates (Operational, Degraded Performance, Partial Outage, Major Outage).
- **Incident Management**: Create, update, and resolve incidents.
- **Real-time Updates**: WebSocket support to push updates in real-time to connected clients.

---

## **Getting Started**

### **1. Prerequisites**

- Node.js (v16+)
- MongoDB (local or cloud-based, e.g., MongoDB Atlas)
- Git (optional, for cloning the repository)

### **2. Installation**

1. Clone the repository:
   git clone https://github.com/Ayushbatwada/Plivo.git
   cd Plivo/backend

2. Install dependencies:
   npm install

### **3. Configuration**

1. Create a `.env` file in the root directory and add values of following environment variables:
   MONGODB_NAME=""
   MONGODB_URI=""
   MONGODB_USERNAME=""
   MONGODB_PASSWORD=""
   REDIS_PASSWORD=""
   REDISURL=""
   JWT_SECRET_KEY=""
   EMAIL=""
   EMAIL_PASSWORD=""
2. Update development config with same values for running on local **/backend/environment/development.json**
3. For Email password, you have to create password
   Go to https://myaccount.google.com/apppasswords and create password and add in above EMAIL_PASSWORD variable


### **4. Run the Server**

Start the backend
npm run dev:start (development)
npm run dev:prod (production)

The server should now be running on `http://localhost:3200`.

---

## **API Endpoints**

### **1. Service Management**

| Method | Endpoint                       | Description              |
|--------|--------------------------------|--------------------------|
| GET    | v1/api/services/get/all        | Get all services         |
| POST   | v1/api/services/create/new     | Create new service       |
| PUT    | v1/api/services/status/change  | Change status of service |
| PUT    | v1/api/services/edit           | Edit service             |

External API - **<server_base_url>/v1/api/services/status/:serviceId** For checking status of the application - **Replace :serviceId to original service id**

### **2. Incident Management**

| Method | Endpoint                       | Description                 |
|--------|--------------------------------|-----------------------------|
| GET    | v1/api/incidenst/get/all       | Get all incidents           |
| POST   | v1/api/incidents/create/new    | Create new incident         | 
| PUT    | v1/api/incidents/status/change | Change status of service    |
| PUT    | v1/api/incidents/edit          | Update a incident           |


Send **x-access-token** and **x-caller-id** in headers for authentication post login

Only Admin can have access to create, edit and change the status of services and incidents
So to make someone as admin, call this api - **<server_base_url>/admin/:userId - Replace :usedId with original id**


# Frontend ReadMe

### **1. Installation and Setup**

1. Clone the repository:
   git clone https://github.com/Ayushbatwada/Plivo.git
   cd Plivo/frontend 

2. Add two env file
   1. env.development
   2. env.production

   Add below values in both the files
   REACT_APP_SERVER_BASE_URL=http://localhost:3200
   REACT_APP_SERVER_URL=http://localhost:3200/v1/api
   REACT_APP_ENV=development
   PORT=4000 

3. Install dependencies:
   npm install 

4. Run the server
   npm run start 

5. For production
   npm run build and then deploy build folder
