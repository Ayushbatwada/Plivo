# Backend ReadMe

This README provides detailed instructions and information about the backend of the Status Page application. Follow the steps below to set up and run the backend server.

## **Features**

- **Services Management**: CRUD operations for services, including status updates (Operational, Degraded Performance, Partial Outage, Major Outage).
- **Incident Management**: Create, update, and resolve incidents.
- **Real-time Updates**: WebSocket support to push updates in real-time to connected clients.
- **Multi-Tenancy Support**: Ability to associate services and incidents with specific organizations.

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

1. Create a `.env` file in the root directory:
   MONGO_URI=<your-mongodb-connection-string>
   MONGODB_NAME=<Your db name>
   PORT=5000
   JWT_SECRET=<your-secret-key>

2. Replace `<your-mongodb-connection-string>` with the URL to your MongoDB instance.
3. Replace `<your-secret-key>` with a secret key for JWT authentication.
4. Replace `<MONGODB_NAME>` with a database name.

### **4. Run the Server**

Start the backend
npm run dev:start (development)
npm run dev:prod (production)

The server should now be running on `http://localhost:6000`.

---

## **API Endpoints**

### **1. Service Management**

| Method | Endpoint                    | Description                |
|--------|-----------------------------|----------------------------|
| GET    | v1/api/services/get/all     | Get all services           |
| POST   | v1/api/services/create/new  | Create new service         |
| PUT    | v1/api/services/update      | Update a service           |
| Patch  | v1/api/services/delete      | Delete a service           |

### **2. Incident Management**

| Method | Endpoint                     | Description                |
|--------|------------------------------|----------------------------|
| GET    | v1/api/incidenst/get/all     | Get all incidents         |
| POST   | v1/api/incidents/create/new  | Create new incident       | 
| PUT    | v1/api/incidents/update      | Update a incident         |



# Frontend ReadMe

### **2. Installation**

1. Clone the repository:
   git clone https://github.com/Ayushbatwada/Plivo.git
   cd Plivo/frontend

2. Install dependencies:
   npm install

3. Run the server
   npm run start
