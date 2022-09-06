import "./Display.css";
import {useState, useEffect} from 'react';
import {db} from '../../firebase';
import {collection, getDocs, deleteDoc, doc} from 'firebase/firestore';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import convertToDHM from "../modules/convertToDHM";
import parseDates from "../modules/parseDates";

function Display() {
    const [activities, setActivities] = useState([]);
    const [original, setOriginal] = useState([]);
    const activitiesCollection = collection(db, "activities");

    const [dateFilter, setDateFilter] = useState({startDate: "", startTime: "", endDate: "", endTime: ""});
    const [sortType, setSortType] = useState({type: ""});

    const [error, setError] = useState("");

    const getActivities = async() => {
        const data = await getDocs(activitiesCollection);
        setActivities(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
        setOriginal(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
    };

    useEffect(() => {
        getActivities();
    }, []);

    const submitHandler = event => {
        event.preventDefault();

        let start = parseDates(dateFilter.startTime, dateFilter.startDate, "start");
        let end = parseDates(dateFilter.endTime, dateFilter.endDate, "end");

        if(checkMapPossible(start, end)) {
            const displayDB = filterDates(start, end);
            setActivities(sortTable(displayDB, sortType.type));
        }
        
    }

    function checkMapPossible(start, end) {
        if(end !== false && start !== false) {
            if(!validateDates(start, end)) {
                return false;
            }
        }
        return true;
    }

    function validateDates(start, end) {
        if(end > start || end - start === 0) {
            setError("");
            return true;
        }
        setError("*Please ensure your input end date & time is after start end & time.");
        return false;
    }

    function sortTable(activities, sort) {
        if(sort === "name") {
            activities.sort(function(a,b) {
                let key1 = a.name.toLowerCase();
                let key2 = b.name.toLowerCase();
    
                return (key1 < key2) ? -1 : 1;
            });
        } else if(sort === "start"){
            activities.sort(function(a,b) {
                let key1 = a.start;
                let key2 = b.start;
    
                return (key1 < key2) ? -1 : 1;
            });
        } else if(sort === "end"){
            activities.sort(function(a,b) {
                let key1 = a.end;
                let key2 = b.end;
    
                return (key1 < key2) ? -1 : 1;
            });
        } else if(sort === "elapse") {
            activities.sort(function(a,b) {
                let key1 = a.elapse;
                let key2 = b.elapse;
    
                return (key1 < key2) ? -1 : 1;
            });
        }
        return activities;
    }

    function filterDates(start, end) {
        const filteredActivities = original.filter((row) => {
            let filterPass = true
            const startDate = new Date(row.start.toDate())
            const endDate = new Date(row.end.toDate())

            if (dateFilter.startDate) {
                filterPass = filterPass && (start <= startDate)
            }
            if (dateFilter.endDate) {
                filterPass = filterPass && (end >= endDate)
            }
            return filterPass
        });

        return filteredActivities;
    }

    const deleteUser = async (id) => {
        let user = doc(db, "activities", id);
        await deleteDoc(user);
        window.location.reload();
    }

    const renderActivity = (activity, index) => {
        return (
            <tr key={index}>
                <td>{activity.name}</td>
                <td>{activity.type}</td>
                <td>{activity.start.toDate().toDateString() + ",  " + activity.start.toDate().toLocaleTimeString('en-US', { hour12: true})} </td>
                <td>{activity.end.toDate().toDateString() + ",  " + activity.end.toDate().toLocaleTimeString('en-US', { hour12: true})}</td>
                <td>{convertToDHM(activity.elapse)}</td>
                <td class="text-center"><button type="button" class="btn btn-outline-danger btn-sm" onClick={() => {deleteUser(activity.id)}}>Delete</button></td>
            </tr>
        );
    }

    return (
        <div>
            <div class="selector-container">
                <div class="card">
                    <div class="row">
                        <div class="col-10">
                            <div class="title-container">
                                <h4>I only want to see activities from...</h4>
                                <p class="text-secondary">Please note if input on time is left empty, time will be defaulted to 12:00am.</p>
                            </div>
                        </div>
                    </div>
                    <Form>
                        <Row>
                            {(error !== "") ? (<p class="text-danger">{error}</p>) : ""}
                            <Col lg="5">
                                <Form.Label>Start Date and Time</Form.Label>
                                <Row>
                                    <Col sm="6">
                                        <Form.Control type="date" name='start_date' onChange={event => setDateFilter({...dateFilter, startDate: event.target.value})}/>
                                    </Col>
                                    <Col sm="5">
                                        <Form.Control type="time" name='start_time' onChange={event => setDateFilter({...dateFilter, startTime: event.target.value})}/>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg="5">
                                <Form.Label>End Date and Time</Form.Label>
                                <Row>
                                    <Col sm="6">
                                        <Form.Control type="date" name='end_date' onChange={event => setDateFilter({...dateFilter, endDate: event.target.value})}/>
                                    </Col>
                                    <Col sm="5">
                                        <Form.Control type="time" name='end_time' onChange={event => setDateFilter({...dateFilter, endTime: event.target.value})}/>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg="2">
                                <Form.Label>Sort Option</Form.Label>
                                <Form.Select aria-label="Default select example" onChange={event => setSortType({...sortType, type: event.target.value})}>
                                    <option>Sort by...</option>
                                    <option value="name">Name</option>
                                    <option value="start">Start Date</option>
                                    <option value="end">End Date</option>
                                    <option value="elapse">Elapsed</option>
                                </Form.Select>
                            </Col>
                        </Row>
                        <Row>
                            <div class="col-1 search-container">
                                <Button variant="outline-primary" type="submit" onClick={submitHandler}>
                                    Search
                                </Button>
                            </div>
                        </Row>
                    </Form>
                </div>
            </div>
            <div class="row justify-content-md-center">
                <div class="table-container">
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th class="text-center">Name</th>
                                <th class="text-center">Type</th>
                                <th class="text-center">Start Time</th>
                                <th class="text-center">End Time</th>
                                <th class="text-center">Elapsed Time</th>
                                <th class="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activities.map(renderActivity)}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default Display;