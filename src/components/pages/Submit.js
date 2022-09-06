import "./Submit.css";
import React from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import {Link} from 'react-router-dom';

import {useState, useEffect} from 'react';
import {db} from '../../firebase';
import {addDoc, collection, getDocs} from 'firebase/firestore';

//function that parses dates into date+time format
import parseDates from "../modules/parseDates";

function Submit() {
    const [details, setDetails] = useState({name: "", type: ""});
    var elapse
    var startDateTime = "", endDateTime = "";
    const [dates, setDates] = useState({startDate: "", startTime: "", endDate: "", endTime: ""})
    const [error, setError] = useState("");

    const [activities, setActivities] = useState([]);
    const activitiesCollection = collection(db, "activities");

    const [show, setShow] = useState(false);
    const handleClose = () => {setShow(false); window.location.reload();};
    const handleShow = () => setShow(true);

    useEffect(() => {
        const getActivities = async() => {
            const data = await getDocs(activitiesCollection);
            setActivities(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
        };

        getActivities();
    }, [activities, activitiesCollection]);
    
    const addActivity = async () => {
        await addDoc(activitiesCollection, {name: details.name, type: details.type, start: startDateTime, end: endDateTime, elapse: elapse})
    }

    //calculate how many minutes is between activity start & end
    function calculateElapse() {
        var difference = endDateTime.getTime() - startDateTime.getTime();
        var inMinutes = Math.round(difference / 60000);
        elapse = inMinutes;
    }

    //parses dates into date+time format; returns true if both fields are able to be parsed
    function validateDates() {
        startDateTime = parseDates( dates.startDate, dates.startTime);
        endDateTime = parseDates(dates.endDate, dates.endTime);

        return(validateDateDiff());
    }

    //checks if activity end occurs before/ activity start or as activity starts
    function validateDateDiff() {
        if(endDateTime > startDateTime) {
            setError("");
            return true;
        } else {
            setError("*Activities cannot end before they begin or as they begin (have a elapsed time of 0 minutes or less)!");
        }
        return false;
    }

    //ensures all fields are filled out
    function validateFields() {
        let error = "*Activity requires a ";
        if(details.name === "") {
            setError(error + "name.");
            return false;
        } else if(details.type === "") {
            setError(error + "type.");
            return false;
        } else if(dates.startDate === "" || dates.startTime === "" || dates.endDate === "" || dates.endTime === "") {
            setError(error + "start date & time and an end date & time.");
            return false;
        }
        error = "";
        return true;
    }

    const submitHandler = event => {
        event.preventDefault();
        if(validateFields()) {
            if(validateDates()) {
                calculateElapse();
                addActivity(details);
                handleShow();
            }
        }
    }

    return (
        <div class="container">
            <div class="row form-container">
                <div class="col-10">
                    <Container>
                        <Row>
                            <Form>
                                {(error !== "") ? (<p class="text-danger">{error}</p>) : ""}
                                <div class="form">
                                    <Form.Group>
                                        <Form.Label>Activity Name</Form.Label>
                                        <Col lg="3">
                                            <Form.Control type="text" placeholder="e.g. Skiing" onChange={event => setDetails({...details, name: event.target.value})}/>
                                        </Col>
                                    </Form.Group>
                                </div>
                                <div class="form">
                                    <Form.Group>
                                        <Form.Label>Type</Form.Label>
                                        <Col lg="3">
                                            <Form.Select aria-label="Default select example" onChange={event => setDetails({...details, type: event.target.value})}>
                                                <option>Select a type</option>
                                                <option value="Phone Call">Phone Call</option>
                                                <option value="Email">Email</option>
                                                <option value="Document">Document</option>
                                                <option value="Appointment">Appointment</option>
                                            </Form.Select>
                                        </Col>
                                    </Form.Group>
                                </div>
                                <div class="form">
                                    <Form.Group>
                                        <Form.Label>Start Date and Time</Form.Label>
                                        <Row>
                                            <Col sm lg="3">
                                                <Form.Control type="date" name='start_date' onChange={event => setDates({...dates, startDate: event.target.value})}/>
                                            </Col>
                                            <Col sm lg="3">
                                                <Form.Control type="time" name='start_time'onChange={event => setDates({...dates, startTime: event.target.value})}/>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </div>
                                <div class="form">
                                    <Form.Group>
                                        <Form.Label>End Date and Time</Form.Label>
                                        <Row>
                                            <Col sm lg="3">
                                                <Form.Control type="date" name='end_date' onChange={event => setDates({...dates, endDate: event.target.value})}/>
                                            </Col>
                                            <Col sm lg="3">
                                                <Form.Control type="time" name='end_time' onChange={event => setDates({...dates, endTime: event.target.value})}/>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </div>
                                <div class="button-container">
                                    <Button variant="primary" type="submit" onClick={submitHandler}>
                                        Submit
                                    </Button>
                                </div>
                            </Form>
                        </Row>
                    </Container>
                </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>{details.name} has been added. You can now see it in <Link to="/">activities</Link>.</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Submit;