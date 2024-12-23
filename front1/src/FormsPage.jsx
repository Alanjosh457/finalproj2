import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import styles from "./formsPage.module.css"; // Assuming you have styling for the page

const FormsPage = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const [formFields, setFormFields] = useState([]); // Store the sequence of fields added

  // Handle adding new input field or response type to form
  const handleAddField = (fieldType) => {
    const newField = { type: fieldType, label: fieldType, value: "" };
    setFormFields([...formFields, newField]); // Add new field to the sequence
  };

  // Handle navigation to the response page
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/response", { state: { formFields } }); // Navigate to the response page with formFields as state
  };

  return (
    <div className={styles.formbotContainer}>
      <h1>Form Generator</h1>
      <div className={styles.mainContent}>
        <div className={styles.sidebar}>
          <h3>Form Inputs</h3>
          <button onClick={() => handleAddField("text")}>Text</button>
          <button onClick={() => handleAddField("phone")}>Phone</button>
          <button onClick={() => handleAddField("email")}>Email</button>
          <button onClick={() => handleAddField("bubble")}>Text Bubble</button>
          <button onClick={() => handleAddField("image")}>Image</button>
          <button onClick={() => handleAddField("video")}>Video</button>
          <button onClick={() => handleAddField("gif")}>GIF</button>
          <button onClick={() => handleAddField("date")}>Date</button>
          <button onClick={() => handleAddField("rating")}>Rating</button>
          <button onClick={() => handleAddField("submit")}>Submit Button</button>
        </div>

        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            {formFields.map((field, index) => (
              <div key={index} className={styles.formField}>
                <label>{field.label}</label>

                {/* Input Fields */}
                {field.type === "text" && (
                  <input
                    type="text"
                    value={field.value}
                    readOnly
                    placeholder="Text field (applicant only)"
                  />
                )}
                {field.type === "phone" && (
                  <input
                    type="tel"
                    value={field.value}
                    readOnly
                    placeholder="Phone field (applicant only)"
                  />
                )}
                {field.type === "email" && (
                  <input
                    type="email"
                    value={field.value}
                    readOnly
                    placeholder="Email field (applicant only)"
                  />
                )}

                {/* Text Bubble */}
                {field.type === "bubble" && (
                  <div>
                    <textarea
                      value={field.value}
                      placeholder="Enter text for bubble"
                      onChange={(e) => {
                        const updatedFields = [...formFields];
                        updatedFields[index].value = e.target.value;
                        setFormFields(updatedFields);
                      }}
                      className={styles.textBubble}
                    />
                  </div>
                )}

                {/* Image Upload */}
                {field.type === "image" && (
                  <div>
                    <label>Upload Image:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const updatedFields = [...formFields];
                        updatedFields[index].value = URL.createObjectURL(
                          e.target.files[0]
                        );
                        setFormFields(updatedFields);
                      }}
                    />
                    {field.value && (
                      <img
                        src={field.value}
                        alt="Uploaded"
                        className={styles.uploadedImage}
                      />
                    )}
                  </div>
                )}

                {/* Video Upload */}
                {field.type === "video" && (
                  <div>
                    <label>Upload Video:</label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const updatedFields = [...formFields];
                        updatedFields[index].value = URL.createObjectURL(
                          e.target.files[0]
                        );
                        setFormFields(updatedFields);
                      }}
                    />
                    {field.value && (
                      <video
                        src={field.value}
                        controls
                        className={styles.uploadedVideo}
                      />
                    )}
                  </div>
                )}

                {/* GIF Upload */}
                {field.type === "gif" && (
                  <div>
                    <label>Upload GIF:</label>
                    <input
                      type="file"
                      accept="image/gif"
                      onChange={(e) => {
                        const updatedFields = [...formFields];
                        updatedFields[index].value = URL.createObjectURL(
                          e.target.files[0]
                        );
                        setFormFields(updatedFields);
                      }}
                    />
                    {field.value && (
                      <img
                        src={field.value}
                        alt="Uploaded GIF"
                        className={styles.uploadedImage}
                      />
                    )}
                  </div>
                )}

                {/* Date Field */}
                {field.type === "date" && (
                  <input
                    type="date"
                    value={field.value}
                    readOnly
                    placeholder="Select a date (applicant only)"
                  />
                )}

                {/* Rating Field */}
                {field.type === "rating" && (
                  <select
                    value={field.value}
                    readOnly
                    placeholder="Rating (applicant only)"
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
                {field.type === "submit" && <button type="submit">End Form</button>}
              </div>
            ))}
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormsPage;
