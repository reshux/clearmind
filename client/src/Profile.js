import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Table,
  Container,
  Button,
  Modal,
  Form,
  Col,
  Row,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarTimes } from '@fortawesome/free-solid-svg-icons';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appointments: [],
      loaded: false,
      activeModal: null,
      cancellationReason: '',
    };
  }

  // Helper methods and event handlers to open appropriate modal

  handleClose = () => {
    this.setState({ activeModal: null });
  };

  handleShow = (e, appointment) => {
    this.setState({ activeModal: appointment });
  };

  // Capture form data for later PUT request

  onReasonChange = e => {
    this.setState({ cancellationReason: e.target.value });
  };

  // Axios PUT request upon appointment cancellation

  cancelBooking = (e, appointment) => {
    // retrieve JWT token from localStorage
    let token = 'Bearer ' + localStorage.getItem('jwt');
    let url = 'api/v1/appointments/' + appointment.id;
    let reason = this.state.cancellationReason;
    // PUT using authorization header and send over data. Upon success close modal
    axios
      .put(url, { reason: reason }, { headers: { Authorization: token } })
      .then(res => {
        this.handleClose();
      })
      .catch(err => console.log(err));
  };

  componentDidMount() {
    // Request appointments upon component mount
    let token = 'Bearer ' + localStorage.getItem('jwt');
    let user_id = localStorage.getItem('user id');
    let url = '/api/v1/users/' + user_id;
    // axios GET request to load logged in users appointments
    axios
      .get(url, { headers: { Authorization: token } })
      .then(res => {
        this.setState({ appointments: res.data, loaded: true });
      })
      .catch(err => console.log(err));

    // Scroll to top on arrival to component
    window.scrollTo(0, 0);
  }

  render() {
    // Copy the loaded appointments from state, sort them by date
    let sortedArray = [...this.state.appointments];
    sortedArray.sort((a, b) =>
      new Date(a.details.date_time) > new Date(b.details.date_time)
        ? 1
        : new Date(a.details.date_time) < new Date(b.details.date_time)
        ? -1
        : 0,
    );

    let outputArray;
    // Map copied and sorted array elements to return a table row
    if (this.state.loaded) {
      // Boolean checks for loading completion, prevents possible async issues
      outputArray = sortedArray.map(apt => {
        return (
          <tr key={apt.details.id} style={{ minHeight: `5 rem` }}>
            <td>{new Date(apt.details.date_time).toDateString()}</td>
            <td>
              {new Date(apt.details.date_time).toLocaleTimeString('en-CA')}
            </td>
            <td>{apt.clinic}</td>
            <td>{apt.specialist}</td>
            {apt.details.cancelled ? (
              <td style={{ color: `red` }}>Cancelled</td>
            ) : new Date(apt.details.date_time) >= Date.now() ? (
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={e => {
                    this.handleShow(e, apt.details.id);
                  }}
                >
                  <FontAwesomeIcon icon={faCalendarTimes} /> Cancel
                </Button>

                <Modal
                  id={apt.details.id}
                  show={this.state.activeModal === apt.details.id}
                  onHide={this.handleClose}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Your Appointment</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group>
                        <Form.Label>
                          May we ask why you are cancelling your appointment on{' '}
                          {new Date(apt.details.date_time).toDateString()} at{' '}
                          {new Date(apt.details.date_time).toLocaleTimeString(
                            'en-CA',
                          )}
                          ?
                        </Form.Label>
                        <Form.Control
                          placeholder="Cancellation Reason(Optional)"
                          as="textarea"
                          rows="3"
                          value={this.state.sessionDetails}
                          onChange={this.onReasonChange}
                        />
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                      Close
                    </Button>
                    <Button
                      variant="primary"
                      onClick={e => {
                        this.cancelBooking(e, apt.details);
                        apt.details.cancelled = true;
                      }}
                    >
                      Submit
                    </Button>
                  </Modal.Footer>
                </Modal>
              </td>
            ) : (
              <td style={{ fontStyle: `italic` }}> Past </td>
            )}
          </tr>
        );
      });
    }

    // Render Container with mapped appointments.
    // If no appointments exist container is sent with a paragraph.
    // Using ternary to check appontment array length.
    return (
      <Container style={{ marginTop: `5REM` }}>
        <h1 style={{ paddingBottom: `2 rem` }}>Your appointments</h1>
        {this.state.appointments.length > 0 ? (
          <Table borderless responsive="sm">
            <thead style={{ borderBottom: `1px solid black` }}>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Clinic</th>
                <th>Specialist</th>
                <th />
              </tr>
            </thead>
            <tbody>{outputArray}</tbody>
          </Table>
        ) : (
          <Row
            style={{
              flexDirection: `row`,
              marginTop: `2REM`,
              justifyContent: `center`,
            }}
          >
            <Col md={4}>
              <img
                src="https://image.flaticon.com/icons/svg/1247/1247839.svg"
                style={{ width: `5REM` }}
                alt="Calendar"
              />
            </Col>
            <Col md={4}>
              <p>
                It seems that we don't have any appointments for you in our
                system. Want to learn more before booking one? You can head over
                to our <Link to="/resources">resources</Link> page. If you would
                like to book an appointment with one of our specialists now,
                click <Link to="/specialists">here</Link>.
              </p>
            </Col>
          </Row>
        )}
      </Container>
    );
  }
}

export default Profile;
