import "./Display.css";
import {useState, useEffect} from 'react';
import {db} from '../../firebase';
import {collection, getDocs, deleteDoc, doc} from 'firebase/firestore';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//function that converts elapsed time into X Days Y hours Z minutes format
import convertToDHM from "../modules/convertToDHM";
//function that parses dates into date+time format
import parseDates from "../modules/parseDates";

function Display() {
    var defaultTime = '00:00';
    const [activities, setActivities] = useState([]);
    const [original, setOriginal] = useState([]);
    const activitiesCollection = collection(db, "activities");

    const [dateFilter, setDateFilter] = useState({startDate: "", startTime: "", endDate: "", endTime: ""});
    const [sortType, setSortType] = useState({type: ""});

    const [error, setError] = useState("");

    var defaultStartDate = dateFilter.startDate;
    var defaultStartTime = dateFilter.startTime;

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

        var filterStart;
        if(dateFilter.startTime !== "") {
            filterStart = parseDates(dateFilter.startTime, dateFilter.startDate);
        } else {
            filterStart = parseDates(defaultTime, dateFilter.startDate);
        }

        var filterEnd;
        if(dateFilter.startTime !== "") {
            filterEnd = parseDates(dateFilter.endTime, dateFilter.endDate);
        } else {
            filterEnd = parseDates(defaultTime, dateFilter.endDate);
        }

        if(checkMapPossible(filterStart, filterEnd)) {
            const displayDB = filterDates(filterStart, filterEnd);
            setActivities(sortTable(displayDB, sortType.type));
        }
        
    }

    //catches instances where start or end dates/times are invalid. returns true if they are valid
    function checkMapPossible(filterStart, filterEnd) {
        if(filterEnd !== false && filterStart !== false) {
            if(!validateDates(filterStart, filterEnd)) {
                return false;
            }
        }
        return true;
    }

    //check if the end dates/time are before the start dates/time. returns true if it is not earlier than start date/time
    function validateDates(filterStart, filterEnd) {
        if(filterEnd > filterStart || filterEnd - filterStart === 0) {
            setError("");
            return true;
        }
        setError("*Please ensure your input end date & time is after start end & time.");
        return false;
    }

    //sorts the current activities array based on user selection
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

    //puts a filter on the current activities array
    function filterDates(filterStart, filterEnd) {
        const filteredActivities = original.filter((row) => {
            let filterPass = true

            const activityStart = parseDates(row.start.toDate().toLocaleTimeString(), new Date(row.start.toDate()));
            const activityEnd = parseDates(row.end.toDate().toLocaleTimeString(), new Date(row.end.toDate()));

            if (dateFilter.startDate) {
                filterPass = filterPass && (filterStart <= activityStart)
            }
            if (dateFilter.endDate) {
                filterPass = filterPass && (filterEnd >= activityEnd)
            }
            return filterPass
        });
        return filteredActivities;
    }

    //deletes user from DB, refreshes so the latest update is immediately visible
    const deleteUser = async (id) => {
        let user = doc(db, "activities", id);
        await deleteDoc(user);
        window.location.reload();
    }

    //displays activities onto table
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
                                <p class="text-secondary">Please note the default time will be 12:00AM.</p>
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
                                        <Form.Control type="date" name='start_date' onChange={event => setDateFilter({...dateFilter, startDate: event.target.value, endDate: event.target.value})}/>
                                    </Col>
                                    <Col sm="5">
                                        <Form.Control type="time" name='start_time' onChange={event => setDateFilter({...dateFilter, startTime: event.target.value, endTime: event.target.value})}/>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg="5">
                                <Form.Label>End Date and Time</Form.Label>
                                <Row>
                                    <Col sm="6">
                                        <Form.Control type="date" name='end_date' defaultValue={defaultStartDate} onChange={event => setDateFilter({...dateFilter, endDate: event.target.value})}/>
                                    </Col>
                                    <Col sm="5">
                                        <Form.Control type="time" name='end_time' defaultValue={defaultStartTime} onChange={event => setDateFilter({...dateFilter, endTime: event.target.value})}/>
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