import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudUploadAlt,
  faSpinner,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./FileUploader.css";

const FileUploader = ({ onClose, onResponse }) => {
  const [file, setFile] = useState(null);
  const [courseName, setCourseName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
  };

  const uploadFile = async () => {
    if (!courseName) {
      alert("Please enter the course name");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData
      );
      console.log(response.data); // Handle the response from the backend
      onClose(); // Close the uploader component
      onResponse(response.data, courseName); // Pass the response data and course name to the parent component
    } catch (error) {
      console.error(error);
    }

    setIsUploading(false);
  };

  return (
    <div className="overlay">
      <div className="overlay-content">
        <button className="overlay-close" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        {isUploading ? (
          <div className="loading-overlay">
            <FontAwesomeIcon
              icon={faSpinner}
              className="loading-spinner"
              spin
            />
          </div>
        ) : (
          <>
            <Dropzone onDrop={handleDrop} accept=".pdf">
              {({ getRootProps, getInputProps }) => (
                <div className="dropzone" {...getRootProps()}>
                  <input {...getInputProps()} />
                  <FontAwesomeIcon
                    icon={faCloudUploadAlt}
                    className="drop-icon"
                  />
                  <p>
                    Drag and drop a PDF file here, or click to select a file
                  </p>
                </div>
              )}
            </Dropzone>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="Enter course name"
              required
              className="course-input"
            />
          </>
        )}
        {file && (
          <div>
            <p className="file-selected">File selected: {file.name}</p>
            <button
              className="upload-button"
              onClick={uploadFile}
              disabled={isUploading}
            >
              Upload
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
