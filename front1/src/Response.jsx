import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './responsePage.module.css';

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
    console.log('Form responses:', responses); // Log the completed form data
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
              {field.type === 'text' && (
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => handleInputChange(e, index)}
                  placeholder="Enter text"
                />
              )}
              {field.type === 'phone' && (
                <input
                  type="tel"
                  value={field.value}
                  onChange={(e) => handleInputChange(e, index)}
                  placeholder="Enter phone number"
                />
              )}
              {field.type === 'email' && (
                <input
                  type="email"
                  value={field.value}
                  onChange={(e) => handleInputChange(e, index)}
                  placeholder="Enter email"
                />
              )}

              {/* Bubble - Display as text */}
              {field.type === 'bubble' && (
                <div className={styles.bubble}>
                  <p>{field.value}</p>
                </div>
              )}

              {/* Date Field */}
              {field.type === 'date' && (
                <input
                  type="date"
                  value={field.value}
                  onChange={(e) => handleInputChange(e, index)}
                />
              )}

              {/* Rating Field */}
              {field.type === 'rating' && (
                <select
                  value={field.value}
                  onChange={(e) => handleInputChange(e, index)}
                >
                  <option value="">Select Rating</option>
                  <option value="1">1/5</option>
                  <option value="2">2/5</option>
                  <option value="3">3/5</option>
                  <option value="4">4/5</option>
                  <option value="5">5/5</option>
                </select>
              )}

              {/* Submit Button */}
              {field.type === 'submit' && (
                <button type="submit">Submit Form</button>
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
