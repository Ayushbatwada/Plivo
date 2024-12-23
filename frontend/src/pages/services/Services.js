import React, {useState, useEffect, useContext, useRef} from 'react';

import useApi from "../../services/useApi";
import useSocket from "../../services/useSocket";

import Loader from "../../components/loader/Loader";
import SideNav from "../sideNav/SideNav";
import {AuthContext} from "../../services/AuthProvider";
import './Service.css';

function Services() {
    const [services, setServices] = useState([]);
    const [isNewUpdate, setIsNewUpdate] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedService, setSelectedService] = useState({});
    const [isSideBarOpened, setIsSideBarOpened] = useState(false);
    const [flow, setFlow] = useState('');
    const handleEvent = useRef(null);

    const {userInfo} = useContext(AuthContext)
    const apiService = useApi();
    const socketService = useSocket();

    useEffect(() => {
        if (userInfo && userInfo.userId) {
            const handleSocketEvent = (response) => {
                handleEvent.current(response)
            }

            getAllServices();
            socketService.eventEmitter.on(socketService.eventName, handleSocketEvent)

            return () => {
                socketService.eventEmitter.off(socketService.eventName, handleSocketEvent)
            }
        }
    }, [userInfo]);

    handleEvent.current = (response) => {
        switch (response.event) {
            case 'service_status_change':
                services.forEach((service) => {
                    if (service._id === response.serviceId) {
                        service.status = response.status;
                    }
                });
                setServices([...services]);
                break;

            case 'incident_create':
                setIsNewUpdate(true);
                services.forEach((service) => {
                    if (service._id === response.serviceId) {
                        service.statusMessage = 'New incident is open';
                    }
                });
                setServices([...services]);
                break;

            case 'incident_update':
                setIsNewUpdate(true);
                services.forEach((service) => {
                    if (service._id === response.serviceId) {
                        service.statusMessage = 'Check update on opened incident';
                    }
                });
                setServices([...services]);
                break;
            case 'incident_resolve':
                setIsNewUpdate(true);
                services.forEach((service) => {
                    if (service._id === response.serviceId) {
                        service.statusMessage = 'Open incident is now resolved, Cheers!!';
                    }
                });
                setServices([...services]);
                break;
            default:
                break;
        }
    }

    const getAllServices = () => {
        setIsLoading(true);
        apiService.getAllServices().then((response) => {
            if (response && response.data && response.data.data) {
                setServices(response.data.data);
            }
            setIsLoading(false);
        }).catch(() => {
            setIsLoading(false);
        });
    };

    const onServiceStatusUpdateClick = (event, service) => {
        event.stopPropagation();
        setIsSideBarOpened(true);
        setIsNewUpdate(false);
        setSelectedService({...service});
        service.statusMessage = '';
        setServices([...services])
        setFlow('incident_detail');
    }

    const closeSideBar = ({isNewServiceAdded, updatedServices}) => {
        setIsSideBarOpened(false);
        if (isNewServiceAdded) {
            setServices([...updatedServices]);
        }
        setFlow('');
    }

    const openSideNavToCreateNewService = (event) => {
        event.stopPropagation();
        setIsSideBarOpened(true);
        setFlow('create_new_service')
    }

    const openSideNavToUpdateService = (event, service) => {
        event.stopPropagation();
        setIsSideBarOpened(true);
        setSelectedService({...service});
        setFlow('edit_service')
    }

    const openSideNavToCreateIncident = (event, service) => {
        event.stopPropagation();
        setIsSideBarOpened(true);
        setSelectedService({...service});
        setFlow('create_new_incident')
    }

    if (services.length > 0 && !isLoading) {
        return (
            <div className='outerContainer'>
                <div className='headingContainer'>
                    <div className='heading'>Services</div>
                    {
                        userInfo?.roles?.includes('admin') ?
                            <button className='headingBtn' onClick={openSideNavToCreateNewService}>
                                Create service
                            </button> :
                            null
                    }
                </div>
                <div className="servicesContainer">
                    {
                        services?.map((service, index) => {
                            let statusStyle = 'status green';
                            if (service.status === 'major_outage') {
                                statusStyle = 'status red'
                            } else if (service.status !== 'operational') {
                                statusStyle = 'status orange'
                            }
                            return (
                                <div className='card' key={index}
                                     onClick={(event) => onServiceStatusUpdateClick(event, service)}>
                                    <div className='name'>Service name - {service.name}</div>
                                    <div className='description'>Service description
                                        - {service.description || ''}</div>
                                    <div className={statusStyle}>Service status - {service.status}</div>
                                    {isNewUpdate ?
                                        <div className='newUpdate'
                                             onClick={(event) => onServiceStatusUpdateClick(event, service)}>
                                            {service.statusMessage}
                                        </div> : null
                                    }
                                    {
                                        userInfo?.roles?.includes('admin') ?
                                            <div className='actions'>
                                                <button className='outline-btn'
                                                        onClick={(event) => openSideNavToUpdateService(event, service)}>
                                                    Update service
                                                </button>
                                                <button className='solid-btn'
                                                        onClick={(event) => openSideNavToCreateIncident(event, service)}>
                                                    Create Incident
                                                </button>
                                            </div>
                                            : null
                                    }
                                </div>
                            )
                        })
                    }
                    {isSideBarOpened ?
                        <div className='overlay'>
                            <div className='sidebarContainer'>
                                <SideNav selectedService={selectedService} flow={flow} setServices={setServices}
                                         services={services} closeSideBar={closeSideBar}/>
                            </div>
                        </div> : null
                    }
                </div>
            </div>
        )
            ;
    } else if (!isLoading && !services.length) {
        return (
            <div className='outerContainer'>
                <div className='headingContainer'>
                    <div className='heading'>Services</div>
                    {
                        userInfo?.roles?.includes('admin') ?
                            <button className='headingBtn' onClick={openSideNavToCreateNewService}>
                                Create service
                            </button> :
                            null
                    }
                </div>

                <div className='notFound'>
                    Content which you are looking for is not available. If you are admin then please create services by
                    clicking create button
                </div>

                {isSideBarOpened ?
                    <div className='overlay'>
                        <div className='sidebarContainer'>
                            <SideNav selectedService={selectedService} flow={flow} setServices={setServices}
                                     services={services} closeSideBar={closeSideBar}/>
                        </div>
                    </div> : null
                }
            </div>
        )
    } else {
        return <Loader/>
    }
}

export default Services;
