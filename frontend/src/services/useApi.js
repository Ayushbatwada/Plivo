import {useContext} from "react";
import axios from 'axios';
import {AuthContext} from "./AuthProvider";

const useApi = () => {
    const {userInfo} = useContext(AuthContext);

    function getHttpHeader() {
        return {
            'Content-Type': 'application/json',
            'x-access-token': userInfo.jwtToken,
            'x-caller-id': userInfo.userId
        };
    }

    return {
        signin: (payload) => {
            return axios.put(`${process.env.REACT_APP_SERVER_URL}/auth/signin`, payload);
        },

        signup: (payload) => {
            return axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/signup`, payload);
        },

        getAllServices: () => {
            return axios.get(`${process.env.REACT_APP_SERVER_URL}/services/get/all`, {headers: getHttpHeader()});
        },

        createService: (payload) => {
            payload['createdBy'] = {
                userId: userInfo.userId,
                userName: userInfo.name
            }
            return axios.post(`${process.env.REACT_APP_SERVER_URL}/services/create/new`, payload, {headers: getHttpHeader()});
        },

        updateService: (payload) => {
            return axios.put(`${process.env.REACT_APP_SERVER_URL}/services/edit`, payload, {headers: getHttpHeader()});
        },

        changeServiceStatus: (payload) => {
            return axios.put(`${process.env.REACT_APP_SERVER_URL}/services/status/change`, payload, {headers: getHttpHeader()})
        },

        getAllIncidents: (serviceId) => {
            return axios.get(`${process.env.REACT_APP_SERVER_URL}/incidents/get/all?serviceId=${serviceId}`, {headers: getHttpHeader()});
        },

        createIncident: (payload) => {
            payload['createdBy'] = {
                userId: userInfo.userId,
                userName: userInfo.name
            }
            return axios.post(`${process.env.REACT_APP_SERVER_URL}/incidents/create/new`, payload, {headers: getHttpHeader()})
        },

        updateIncident: (payload) => {
            return axios.put(`${process.env.REACT_APP_SERVER_URL}/incidents/edit`, payload, {headers: getHttpHeader()});
        },

        changeIncidentStatus: (payload) => {
            return axios.put(`${process.env.REACT_APP_SERVER_URL}/incidents/status/change`, payload, {headers: getHttpHeader()})
        },
    }
}

export default useApi;
