import React, {useState, useEffect} from 'react';
import useSocket from "../../services/useSocket";
import useApi from "../../services/useApi";
import Loader from "../../components/loader/Loader";
import './SideNav.css'

function SideNav({selectedService, flow, services, closeSideBar}) {
    const [incident, setIncident] = useState();
    const [newUpdate, setNewUpdate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [serviceName, setServiceName] = useState('');
    const [serviceDescription, setServiceDescription] = useState('');
    const [incidentDescription, setIncidentDescription] = useState('');
    const [serviceStatus, setServiceStatus] = useState('');

    const apiService = useApi();
    const socketService = useSocket();

    useEffect(() => {
        if (flow === 'incident_detail') {
            getAllIncidents();
        } else if (flow === 'edit_service') {
            setServiceDescription(selectedService.description);
            setServiceName(selectedService.name);
            setServiceStatus(selectedService.status);
        }
    }, []);

    const getAllIncidents = () => {
        setIsLoading(true);
        apiService.getAllIncidents(selectedService._id).then((response) => {
            if (response && response.data && response.data.data) {
                setIncident(response.data.data[0]);
            }
            setIsLoading(false);
        }).catch(() => {
            setIsLoading(false);
        });
    };

    const sendIncidentUpdate = () => {
        if (newUpdate.trim() && selectedService._id) {
            const payload = {
                incidentId: incident._id,
                update: newUpdate,
            }
            incident.updates.unshift(newUpdate);
            setIncident({...incident});
            setNewUpdate('');
            socketService.updateIncident(payload);
        }
    }

    const resolveIncident = () => {
        if (selectedService._id && selectedService.createdAt) {
            const payload = {
                incidentId: incident._id,
                incidentCreatedAt: selectedService.createdAt
            }
            incident.status = 'resolved';
            setIncident({...incident});
            socketService.incidentResolve(payload);
            closeSideBar();
        }
    }

    const createNewService = () => {
        setIsLoading(true);
        if (serviceName.trim() && serviceDescription.trim()) {
            const payload = {
                name: serviceName,
                description: serviceDescription
            }
            apiService.createService(payload).then((response) => {
                if (response && response.data && response.data.data) {
                    services.push(response.data.data);
                    closeSideBar({isNewServiceAdded: true, services})
                }
                setIsLoading(false);
            }).catch(() => {
                setIsLoading(false);
            })
        }
    }

    const editService = () => {
        setIsLoading(true);

        // Update service
        if (serviceName.trim() && serviceDescription.trim() &&
            (serviceName.trim() !== selectedService.name || serviceDescription.trim() !== selectedService.description)) {
            const payload = {
                name: serviceName,
                description: serviceDescription,
                serviceId: selectedService._id,
            }
            apiService.updateService(payload).then((response) => {
                if (response && response.data && response.data.data) {
                    selectedService.description = serviceDescription;
                    selectedService.name = serviceName;
                    services = services.filter((service) => {
                        return service._id === selectedService._id ? selectedService : service;
                    });
                    closeSideBar({isNewServiceAdded: true, services})
                }
                setIsLoading(false);
            }).catch(() => {
                setIsLoading(false);
            })
        }

        // Change status
        if (serviceStatus !== selectedService.status) {
            const payload = {
                status: serviceStatus,
                serviceId: selectedService._id
            }
            apiService.changeServiceStatus(payload).then((response) => {
                if (response && response.data && response.data.data) {
                    selectedService.status = serviceStatus;
                    services = services.filter((service) => {
                        return service._id === selectedService._id ? selectedService : service;
                    });
                    closeSideBar({isNewServiceAdded: true, services})
                }
                setIsLoading(false);
            }).catch(() => {
                setIsLoading(false);
            })
        }
    }

    const createNewIncident = () => {
        setIsLoading(true);
        const payload = {
            description: incidentDescription,
            serviceId: selectedService._id
        }
        apiService.createIncident(payload).then((response) => {
            setIsLoading(false);
        }).catch(() => {
            setIsLoading(true);
        });
    }

    const onTextChange = (text, flow) => {
        if (flow === 'incident_update') {
            setNewUpdate(text);
        } else if (flow === 'service_name') {
            setServiceName(text);
        } else if (flow === 'service_description') {
            setServiceDescription(text);
        } else if (flow === 'incident_description') {
            setIncidentDescription(text)
        }
    }

    const handleSelectionChange = (value) => {
        setServiceStatus(value);
    };

    const oncloseSideBar = () => {
        closeSideBar({});
    }

    if (!isLoading && flow === 'incident_detail') {
        if (!incident) {
            return (
                <>
                    <div className='heading'>
                        Incident history
                        <button className='btn indianred' onClick={oncloseSideBar}>Cancel</button>
                    </div>
                    <div className='notFound'>
                        No open incident found at the moment, Your service is up and running perfectly
                    </div>
                </>
            )
        }
        return (
            <div className='incidentContainer'>
                <div className='heading'>
                    Incident history
                    <button className='btn indianred' onClick={oncloseSideBar}>Cancel</button>
                </div>
                <div className='name mt20'>Service Name - {selectedService.name}</div>
                <div className='description'>{incident.description}</div>
                <div className='mt20'>Previous Updates</div>
                {
                    incident.updates.map((update, index) => {
                        return <div key={index} className='description'>{index + 1}. {update}</div>
                    })
                }
                <div className='name mt20'>Add update:</div>
                <textarea className='textarea' value={newUpdate} placeholder='Enter new update'
                          onChange={(e) => onTextChange(e.target.value, 'incident_update')}></textarea>
                <button className='btn blue' onClick={sendIncidentUpdate}>Send update</button>
                <button className='btn success' onClick={resolveIncident}>Resolve Incident</button>
            </div>
        )
    } else if (flow === 'create_new_service' || flow === 'edit_service') {
        return (
            <div>
                <div className='heading'>
                    Create new service
                    <button className='btn indianred' onClick={oncloseSideBar}>Cancel</button>
                </div>
                <div className='mt20'>
                    <input className='input-field' value={serviceName} placeholder='Enter service name'
                           onChange={(e) => onTextChange(e.target.value, 'service_name')}/>
                    <textarea className='textarea' value={serviceDescription} placeholder='Enter service description'
                              onChange={(e) => onTextChange(e.target.value, 'service_description')}></textarea>
                    {
                        flow === 'edit_service' ?
                            <div>
                                <div className='name mt10'>Select status</div>
                                <select className='select' value={serviceStatus}
                                        onChange={(event) => handleSelectionChange(event.target.value)}>
                                    <option value='operational'>Operational</option>
                                    <option value='degraded_performance'>degraded_performance</option>
                                    <option value='partial_outage'>partial_outage</option>
                                    <option value='major_outage'>major_outage</option>
                                </select>
                            </div>
                            : null
                    }
                    {
                        flow === 'create_new_service' ?
                            <button className='btn blue' onClick={createNewService}>Create service</button> :
                            <button className='btn blue' onClick={editService}>Edit service</button>
                    }
                </div>
            </div>
        )
    } else if (flow === 'create_new_incident') {
        return (
            <div>
                <div className='heading'>
                    Create new incident
                    <button className='btn indianred' onClick={oncloseSideBar}>Cancel</button>
                </div>
                <div className='mt20'>
                    <textarea className='textarea' value={incidentDescription} placeholder='Enter incident description'
                              onChange={(e) => onTextChange(e.target.value, 'incident_description')}></textarea>
                    <button className='btn blue' onClick={createNewIncident}>Create incident</button>
                </div>
            </div>
        )

    } else if (isLoading) {
        return <Loader/>
    }
}

export default SideNav;
