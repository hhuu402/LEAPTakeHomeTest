import "./Display.css";
import {useState, useEffect} from 'react';
import {db} from '../../firebase';
import {collection, getDocs, deleteDoc, doc} from 'firebase/firestore';
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
    const [parsedDates, setParsedDates] = useState({start: "", end: ""});

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
            filterDates(dateFilter);
        }
    }

    function validateDates(start, end) {
        if(end > start) {
            setError("");
            return true;
            
        }
        setError("*Please ensure your input end date & time is after start end & time.");
        return false;
    }

    function parseDates(inputTime, inputDate, type) {
        
        if(inputDate !== "") {
            let date = new Date(inputDate); 
            let time = inputTime;
            let parsedDate = new Date(Date.parse(date.toDateString() + ' ' + time));
            if(type === "start") {
                setParsedDates({start: parsedDate});
            } else {
                setParsedDates({end: parsedDate});
            }
            return true;
        }

        return false;

    }


    const filterDates = (dateFilter) => {
        let time = dateFilter.startTime;
        let date = new Date(dateFilter.startDate);
        let parsedStartDate = new Date(Date.parse(date.toDateString() + ' ' + time));

        time = dateFilter.endTime;
        date = new Date(dateFilter.endDate);
        let parsedEndDate = new Date(Date.parse(date.toDateString() + ' ' + time));

        const filteredActivities = original.filter((row) => {
            let filterPass = true
            const startDate = new Date(row.start.toDate())
            const endDate = new Date(row.end.toDate())

            console.log(date);

            if (dateFilter.startDate) {
                filterPass = filterPass && (parsedStartDate < startDate)
            }
            if (dateFilter.endDate) {
                filterPass = filterPass && (parsedEndDate > endDate)
            }
            return filterPass
        });

        setActivities(filteredActivities);
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

    return (
        <div>
            <div class="selector-container">
                <div class="card">
                    <Container>
                        <div class="title-container">
                            <h4>I only want to see activities from...</h4>
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