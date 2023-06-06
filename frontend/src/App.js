import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileArrowUp,
  faInfoCircle,
  faTimes,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import FileUploader from "./components/FileUploader";
import { v4 as uuid } from "uuid";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@material-ui/core";

function App() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [responses, setResponses] = useState([]);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    console.log("Getting Responses from Local Storage");
    const localResponses = localStorage.getItem("responses");
    if (localResponses) {
      setResponses(JSON.parse(localResponses));
    }
  }, []);

  const saveResponses = (responses) => {
    console.log("Saving Responses to Local Storage");
    localStorage.setItem("responses", JSON.stringify(responses));
  };

  const handleUploadClick = () => {
    setShowOverlay(true);
  };

  const handleInfoClick = () => {
    setShowInfo(true);
  };

  const handleOverlayClose = () => {
    setShowOverlay(false);
  };

  const handleInfoClose = () => {
    setShowInfo(false);
    setSelectedResponse(null);
  };

  const handleResponse = (response, courseName) => {
    const newResponse = {
      id: uuid(),
      data: response.Deadlines,
      courseName: courseName,
    };
    setResponses((prevResponses) => [...prevResponses, newResponse]);
    saveResponses([...responses, newResponse]);
  };

  const handleBoxClick = (response) => {
    setSelectedResponse(response);
    setShowInfo(true);
  };

  const handleDeleteClick = () => {
    setShowConfirmation(true);
  };

  const handleDeleteConfirmation = () => {
    const filteredResponses = responses.filter(
      (response) => response.id !== selectedResponse.id
    );
    setResponses(filteredResponses);
    saveResponses(filteredResponses);
    setShowConfirmation(false);
    setSelectedResponse(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <button className="upload-button" onClick={handleUploadClick}>
          <FontAwesomeIcon icon={faFileArrowUp} /> Upload
        </button>
        <h1 className="App-title">Course Outline Analyzer</h1>
        <div className="info-button-wrapper">
          <button className="info-button" onClick={handleInfoClick}>
            <FontAwesomeIcon icon={faInfoCircle} /> Info
          </button>
          <div className={`tooltip ${showInfo ? "show" : ""}`}>
            <p>Upload your course outline and wair for 10 - 15 seconds.</p>
            <p>This webpage is integrated with ChatGPT, response may not be ACCURATE.</p>
            <p>Name your course and upload your course outline.</p>
            <p>View your course outline's assignments, midterms and exams deadlines.</p>
          </div>
        </div>
      </header>
      {showOverlay && (
        <FileUploader
          onClose={handleOverlayClose}
          onResponse={handleResponse}
        />
      )}
      {showInfo && selectedResponse && (
        <div className="overlay" onClick={handleInfoClose}>
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <button className="overlay-close" onClick={handleInfoClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className="response-info">
              <div className="response-info">
                <h2>{selectedResponse.courseName}</h2>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Weight</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedResponse.data.map((deadline, index) => (
                        <TableRow key={index}>
                          <TableCell>{deadline.name}</TableCell>
                          <TableCell>
                            {new Date(deadline.date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </TableCell>
                          <TableCell>{deadline.weight}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <button className="delete-button" onClick={handleDeleteClick}>
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="response-boxes">
        {responses.map((response) => (
          <div
            className="response-box"
            key={response.id}
            onClick={() => handleBoxClick(response)}
          >
            <h3>{response.courseName}</h3>
          </div>
        ))}
      </div>
      <Dialog
        open={showConfirmation}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this response?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirmation} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;
