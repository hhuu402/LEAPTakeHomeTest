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

function Submit() {
    const [details, setDetails] = useState({name: "", type: "", start: "", end: "", elapse: ""});
    const [dates, setDates] = useState({startDate: "", startTime: "", endDate: "", endTime: ""})
    const [error, setError] = useState("");

    const [activities, setActivities] = useState([]);
    const activCollection = collection(db, "activities");

    const [show, setShow] = useState(false);
    const handleClose = () => {setShow(false); window.location.reload();};
    const handleShow = () => setShow(true);

    useEffect(() => {
        const getActivities = async() => {
            const data = await getDocs(activCollection);
            setActivities(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
        };

        getActivities();
    }, []);
    
    const addActivity = async () => {
        await addDoc(activCollection, {name: details.name, type: details.type, start: details.start, end: details.end, elapse: details.elapse})
    }

    function calculateElapse() {
        var difference = details.end.getTime() - details.start.getTime();
        var inMinutes = Math.round(difference / 60000);
        details.elapse = inMinutes;
    }

    function parseDates() {
        let time = dates.startTime;
        let date = new Date(dates.startDate);
        let parsedDate = new Date(Date.parse(date.toDateString() + ' ' + time));

        details.start = parsedDate;

        time = dates.endTime;
        date = new Date(dates.endDate);
        parsedDate = new Date(Date.parse(date.toDateString() + ' ' + time));

        details.end = parsedDate;

        return(validateDateDiff())
    }

    function validateDateDiff() {
        if(details.end > details.start) {
            setError("");
            return true;
        } else {
            setError("*Activities cannot end before they begin or as they begin (have a elapsed time of 0 minutes or less)!");
        }
        return false;
    }

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
            if(parseDates()) {
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
                                <Form.Group class="row-padding-class" className="mb-3" controlId="formName">
                                    <Form.Label>Activity Name</Form.Label>
                                    <Col lg="3">
                                        <Form.Control type="text" placeholder="e.g. Skiing" onChange={event => setDetails({...details, name: event.target.value})}/>
                                    </Col>
                                </Form.Group>
                                <Form.Group class="row-padding-class" className="mb-3" controlId="formType">
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
                                <Form.Group class="row-padding-class" className="mb-3" controlId="formStartDT">
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
                                <Form.Group class="row-padding-class" className="mb-3" controlId="formEndDT">
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