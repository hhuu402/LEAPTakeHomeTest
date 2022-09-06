import "./Display.css";
import {useState, useEffect} from 'react';
import {db} from '../../firebase';
import {collection, getDocs, deleteDoc, doc, arrayRemove} from 'firebase/firestore';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

function Display() {

    const [activities, setActivities] = useState([]);
    const [original, setOriginal] = useState([]);
    const activCollection = collection(db, "activities");

    const [dateFilter, setDateFilter] = useState({startDate: "", startTime: "", endDate: "", endTime: ""});

    const [sortType, setSortType] = useState({type: ""});

    const [error, setError] = useState("");


    const getActivities = async() => {
        const data = await getDocs(activCollection);
        setActivities(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
        setOriginal(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
    };

    useEffect(() => {
        getActivities();
    }, []);

    const submitHandler = event => {
        event.preventDefault();
        if(dateFilter.startDate !== "" || dateFilter.endDate !== "") {
            const displayDB = filterDates(dateFilter);
            setActivities(sortTable(displayDB, sortType.type));
        }
    }

    function validateDates(start, end) {
        if(end > start) {
            setError("");
            return true;
        }

        if(end - start === 0) {
            setError("");
            return true;
        }

        setError("*Please ensure your input end date & time is after start end & time.");
        return false;
    }

    function parseDates(inputTime, inputDate) {
        if(inputDate !== "") {
            let date = new Date(inputDate); 
            let time = inputTime;
            
            return new Date(Date.parse(date.toDateString() + ' ' + time));
        }
        return;
    }

    const filterDates = (dateFilter) => {
        let start = parseDates(dateFilter.startTime, dateFilter.startDate, "start");
        let end = parseDates(dateFilter.endTime, dateFilter.endDate, "end");

        if(typeof end !== "undefined" && typeof start !== "undefined") {
            if(!validateDates(start, end)) {
                return;
            }
        }

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

        //setActivities(sortTable(filteredActivities, sortType.type));
        //setActivities(filteredActivities);
        console.log(filteredActivities)
        return filteredActivities;
    }

    const toHoursMinutes = (mins) => {
        let minutes = mins % 60;
        let hours = Math.floor(mins/60);
        let days = Math.floor(hours/24);

        let convertedStr = "";

        if(days > 0) {
            convertedStr = convertedStr + days + " Day(s) "
            hours = hours % 24;
        }

        if(hours > 0) {
            convertedStr = convertedStr + hours + " Hour(s) "
        }

        if(minutes > 0) {
            convertedStr = convertedStr + minutes + " Minute(s)"
        }

        return convertedStr;
    }

    const deleteUser = async (id) => {
        let user = doc(db, "activities", id);
        await deleteDoc(user);
        window.location.reload();
    }

    const renderActivity = (activity, index) => {
        return (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{activity.name}</td>
                <td>{activity.type}</td>
                <td>{activity.start.toDate().toDateString() + ",  " + activity.start.toDate().toLocaleTimeString('en-US', { hour12: true})} </td>
                <td>{activity.end.toDate().toDateString() + ",  " + activity.end.toDate().toLocaleTimeString('en-US', { hour12: true})}</td>
                <td>{toHoursMinutes(activity.elapse)}</td>
                <td class="text-center"><button type="button" class="btn btn-outline-danger btn-sm" onClick={() => {deleteUser(activity.id)}}>Delete</button></td>
            </tr>
            
        );
    }

    function sortTable(activities, sort) {
        if(sort === "name") {
            activities.sort(function(a,b) {
                let key1 = a.name.toLowerCase();
                let key2 = b.name.toLowerCase();
    
                if(key1 < key2) return -1;
                if(key1 > key2) return 1;
            });
        } else if(sort === "start"){
            activities.sort(function(a,b) {
                let key1 = a.start;
                let key2 = b.start;

                if(key1 < key2) return -1;
                if(key1 > key2) return 1;
            });
        } else if(sort === "end"){
            activities.sort(function(a,b) {
                let key1 = a.end;
                let key2 = b.end;

                if(key1 < key2) return -1;
                if(key1 > key2) return 1;
            });
        } else if(sort === "elapse") {
            activities.sort(function(a,b) {
                let key1 = a.elapse;
                let key2 = b.elapse;

                if(key1 < key2) return -1;
                if(key1 > key2) return 1;
            });
        }
        return activities;
    }

    return (
        <div>
            <div class="selector-container">
                <div class="card">
                    <Container>
                        <div class="title-container">
                            <h4>I only want to see activities from...</h4>
                            <p class="text-secondary">Please note if input on time is left empty, time will be defaulted to 12:00am.</p>
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
                            </Row>
                            <Row>
                                <Col md="2">
                                    <Form.Select aria-label="Default select example" onChange={event => setSortType({...sortType, type: event.target.value})}>
                                        <option>Sort by...</option>
                                        <option value="name">Name</option>
                                        <option value="start">Start Date</option>
                                        <option value="end">End Date</option>
                                        <option value="elapse">Elapsed</option>
                                    </Form.Select>
                                </Col>
                                <Col>
                                    <Button variant="primary" type="submit" onClick={submitHandler}>
                                        Search
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Container>
                </div>
            </div>
            <div class="row justify-content-md-center">
                <div class="table-container">
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th class="text-center">#</th>
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