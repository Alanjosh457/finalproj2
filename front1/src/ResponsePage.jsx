import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./responsePage.module.css";

const ResponsePage = () => {
  const location = useLocation();
  const { formFields } = location.state || {}; // Get formFields passed from FormsPage
  const [responses, setResponses] = useState(formFields || []); // State to handle applicant responses

  const handleInputChange = (e, index) => {
    const updatedResponses = [...responses];
    updatedResponses[index].value = e.target.value;
    setResponses(updatedResponses); // Update the responses state
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form responses:", responses); // Log the completed form data
    // Optionally send responses to a backend server
  };

  return (
    <div className={styles.responseContainer}>
      <h1>Fill Out the Form</h1>
      {responses && responses.length > 0 ? (
        <form onSubmit={handleSubmit}>
          {responses.map((field, index) => (
            <div key={index} className={styles.formField}>
              <label>{field.label}</label>

              {/* Editable Inputs for Applicant */}
              {field.type === "text" && (
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => handleInputChange(e, index)}
                  placeholder="Enter text"
                />
              )}

              {/* Bubble - Display as text */}
              {field.type === "bubble" && (
                <div className={styles.bubble}>
                  <p>{field.value}</p>
                </div>
              )}

              {/* Image Field */}
              {field.type === "image" && field.value && (
                <div>
                  <img
                    src={field.value}
                    alt="Uploaded"
                    className={styles.uploadedImage}
                  />
                </div>
              )}

              {/* Handle Missing Image */}
              {field.type === "image" && !field.value && (
                <p className={styles.error}>Image not found</p>
              )}

              {/* Submit Button */}
              {field.type === "submit" && (
                <button type="submit" className={styles.submitButton}>
                  Submit Form
                </button>
              )}
            </div>
          ))}
        </form>
      ) : (
        <p>No fields found to display.</p>
      )}
    </div>
  );
};

export default ResponsePage;
