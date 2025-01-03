import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getForms, submitResponse,incrementViewCount,incrementStarts} from "./services";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import styles for the date picker
import styles from "./responsePage.module.css";
import sender from './images/send.png'
const ResponsePage = () => {
const { formbotId } = useParams();
const [imageLoading, setImageLoading] = useState(true);
 console.log("Formbot ID from URL:", formbotId);
const [formFields, setFormFields] = useState([]); // Manage formFields from API
const [responses, setResponses] = useState([]);
  const [views, setViews] = useState(0);  // State to handle applicant responses
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0); // Track which field to display
  const [selectedRating, setSelectedRating] = useState(null); // Store selected rating
  const navigate = useNavigate();
  const chatContainerRef = useRef(null); // To scroll to the latest response
  const [startedFilling, setStartedFilling] = useState(false);

  // Extract token from URL query parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tokenFromURL = queryParams.get('token');
  const bubimg='https://res.cloudinary.com/dlmwurg10/image/upload/v1735556185/image_4_ezfuvk.png'
  // Use the token from the URL if available, else fall back to localStorage
  const token = tokenFromURL || localStorage.getItem("token");

  useEffect(() => {
    const updateViewCount = async () => {
      try {
        const success = await incrementViewCount(formbotId, token);
        if (success) {
          console.log("View count successfully incremented.");
        } else {
          console.error("Failed to increment view count.");
        }
      } catch (error) {
        console.error("Error updating view count:", error);
      }
    };

    updateViewCount(); // Call the function to increment view count when the component mounts

  }, [formbotId, token]); 

  useEffect(() => {
    // Fetch form data when formbotId is available
    const fetchFormData = async () => {
      if (!formbotId) {
        console.error("formbotId is missing!");
        return; // Do not proceed if formbotId is undefined
      }
      console.log("Fetched formbotId:", formbotId);
      if (!token) {
        console.error("No token found in URL or localStorage!");
        return;
      }

      try {
        // Fetch forms based on formbotId
        const result = await getForms(token, formbotId);
        console.log("API Response:", result);
        if (result.success) {
          
          const formbotForms = result.forms.filter((form) => form.formbotId === formbotId);
          if (formbotForms.length > 0) {
            const form = formbotForms[0];
            setFormFields(form.fields);  // Set the form fields
            setFormTitle(form.title);
          
          // This should increment the view
           
          } else {
            console.error("No form found for the provided formbotId.");
          }
        } else {
          console.error("Error fetching forms:", result.message);
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchFormData();
  }, [formbotId, token]); // Dependency on formbotId and token to re-fetch when they change


  useEffect(() => {
    console.log("Updated views:", views);
    console.log("Form Fields received:", formFields);
    if (formFields && formFields.length > 0) {
      // Initialize responses with empty values and sort fields by sequence
      const sortedFields = [...formFields]
        .sort((a, b) => a.sequence - b.sequence)
        .map((field) => {
          if (field.type === "image" && field.value && field.value.startsWith("http")) {
            // If the field is an image with a valid URL, retain the value as is
            console.log("Image field detected with URL:", field.value);
            return { ...field }; 
          }
          // For other fields, ensure they have a value (defaulting to empty string if not)
          return { ...field, value: field.value || "" }; 
        });
  
      setResponses(sortedFields);
      console.log("Initialized responses:", sortedFields);
    }
  }, [formFields, views]);  // Added views as a dependency to ensure updates to views trigger re-run
  

  useEffect(() => {
    // Scroll to the latest response
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [currentFieldIndex]);

  const handleInputChange = (e) => {
    const updatedResponses = [...responses];
    updatedResponses[currentFieldIndex].value = e.target.value; // Update only the current field's value
    setResponses(updatedResponses);

    if (!startedFilling && currentFieldIndex === 0 && e.target.value.trim() !== "") {
      setStartedFilling(true);
      incrementStarts(formbotId, token); // Record the start
    }

  };

  const handleDateChange = (date) => {
    const updatedResponses = [...responses];
    // Format the date as a string using toLocaleDateString() or any custom format
    updatedResponses[currentFieldIndex].value = date ? date.toLocaleDateString() : null; // Format date
    setResponses(updatedResponses);
  
    if (!startedFilling && currentFieldIndex === 0 && date) {
      setStartedFilling(true);
      incrementStarts(formbotId, token); // Record the start
    }
  };
  

  const handleRatingChange = (rating) => {
    const updatedResponses = [...responses];
    updatedResponses[currentFieldIndex].value = rating; // Update the rating value
    setResponses(updatedResponses);
    setSelectedRating(rating); // Store the selected rating
    console.log("Updated Responses:", updatedResponses); // Log the updated responses


    if (!startedFilling && currentFieldIndex === 0) {
      setStartedFilling(true);
      incrementStarts(formbotId, token); // Record the start
    }


  };

  useEffect(() => {
    if (responses[currentFieldIndex] && ["bubble", "image"].includes(responses[currentFieldIndex].type)) {
      const timer = setTimeout(() => moveToNextField(), 2000); // Wait 2 seconds before moving
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [currentFieldIndex, responses]);

  const handleSendClick = () => {
    const currentField = responses[currentFieldIndex];

    // Skip fields that do not require input (e.g., bubble, image)
    if (["bubble", "image"].includes(currentField.type)) {
      moveToNextField();
      return;
    }
    if (
      (currentField.type === "text" || currentField.type === "email" || currentField.type === "phone") &&
      !currentField.value?.trim()
    ) {
      alert(`Please fill in the "${currentField.label}" field.`);
      return;
    }
  
 
    if (currentField.type === "rating" && currentField.value === null) {
      alert(`Please select a rating for "${currentField.label}".`);
      return;
    }

    if (currentField.type === "date" && !currentField.value) {
      alert(`Please select a date for "${currentField.label}".`);
      return;
    }


    moveToNextField();
  };

  const moveToNextField = () => {
  
    console.log("Updated responses:", responses);
    if (currentFieldIndex < responses.length - 1) {
      setCurrentFieldIndex((prevIndex) => prevIndex + 1);
    }
  };


  const isValidImageUrl = (url) => {
    return url && url.startsWith("http");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Filter out non-submission fields (e.g., type: 'submit')
    const filteredResponses = responses.filter(response => response.type !== 'submit');
  
    // Validate and transform responses for submission
    const formattedResponses = filteredResponses.map(response => ({
      label: response.label || 'Default Label', // Use a default if label is missing
      value: response.value || 'Default Value', // Use a default if value is missing
    }));

    console.log("Filtered responses:", filteredResponses);
    console.log("Formatted responses for submission:", formattedResponses);

    try {
      // Call the submitResponse function to submit the form data
      const result = await submitResponse(formbotId, formattedResponses);

      if (result.success) {
        console.log("Response submitted successfully:", result.response);
        navigate('/Records'); // Navigate to thank-you page or results
      } else {
        console.error("Error submitting response:", result.message);
        alert(result.message);
      }
    } catch (error) {
      console.error("Error during submission:", error);
      alert("An error occurred while submitting your response. Please try again.");
    }
  };

  if (!responses || responses.length === 0) {
    return <p>No fields found to display.</p>;
  }
  const handleImageLoad = () => {
    setImageLoading(false);
  };


  return (
    
<>

<div className={styles.chatContainer}>
 
  {/* Display the updated views count */}
  
  <div className={styles.messagesContainer} ref={chatContainerRef}>
    {/* Display previous responses as chat bubbles */}
    {responses.slice(0, currentFieldIndex).map((response, index) => (
      <div
        key={index}
        className={`${styles.messageBubble} ${
          response.type === "bubble" || response.type === "image"
            ? styles.incoming
      : styles.outgoing
        }`}
      >
        {/* Render image if field type is "image" */}
        {response.type === "image" && response.value && isValidImageUrl(response.value) ? (
          <div className={styles.imageContainer}>
             {/* Add a static image next to the bubble */}
      <div className={styles.staticImageContainer}>
        <img
          src={bubimg}  // Replace with your desired image source
          alt="Static Image"
          className={styles.staticImage}
        />
      </div>
            <img
              src={response.value}
              alt={response.label}
              className={styles.imagePreview}
              onLoad={() => handleImageLoad(response.value)} // When the image loads
              onError={() => 

                (e) => {
                  console.error(`Failed to load image: ${e.target.src}`);
                  setImageLoading(false);

              } }// In case of error
            />
          </div>
        ) : (
          // Render text or other field types normally
          <p className={styles.lbs}>
           {response.value}
          </p>
        )}
      </div>
    ))}

    {/* Display the current field input */}
    {currentFieldIndex < responses.length && (
      <div className={styles.inputContainer}>
   
        
        {/* Render text input */}
        {responses[currentFieldIndex].type === "text" && (
          <div>
            <input
              type="text"
              value={responses[currentFieldIndex].value || ""}
              onChange={handleInputChange}
              placeholder="Enter text"
              className={styles.inputField}
            />
            <button
              type="button"
              onClick={handleSendClick}
              className={styles.sendButton}
            >
            <img src={sender} className={styles.sendButton2}/>
            </button>
          </div>
        )}

        {/* Render email input */}
        {responses[currentFieldIndex].type === "email" && (
          <div>
            <input
              type="email"
              value={responses[currentFieldIndex].value || ""}
              onChange={handleInputChange}
              placeholder="Enter email"
              className={styles.inputField}
            />
            <button
              type="button"
              onClick={handleSendClick}
              className={styles.sendButton}
            >
              <img src={sender} className={styles.sendButton2}/>
            </button>
          </div>
        )}

        {/* Render phone input */}
        {responses[currentFieldIndex].type === "phone" && (
          <div>
            <input
              type="text"
              value={responses[currentFieldIndex].value || ""}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              className={styles.inputField}
            />
            <button
              type="button"
              onClick={handleSendClick}
              className={styles.sendButton}
            >
               <img src={sender} className={styles.sendButton2}/>
            </button>
          </div>
        )}



{responses[currentFieldIndex].type === "number" && (
          <div>
            <input
              type="text"
              value={responses[currentFieldIndex].value || ""}
              onChange={handleInputChange}
              placeholder="Enter a numeric value"
              className={styles.inputField}
            />
            <button
              type="button"
              onClick={handleSendClick}
              className={styles.sendButton}
            >
               <img src={sender} className={styles.sendButton2}/>
            </button>
          </div>
        )}


        {/* Render date picker */}
       
{responses[currentFieldIndex].type === "date" && (
  <div>
    <DatePicker
      selected={responses[currentFieldIndex].value ? new Date(responses[currentFieldIndex].value) : null} // Convert string back to Date for DatePicker
      onChange={handleDateChange}
      className={styles.inputField}
      calendarClassName={styles.customCalendar} 
      placeholderText="Select a date"
      dateFormat="MM/dd/yyyy"
    />
    <button
      type="button"
      onClick={handleSendClick}
      className={styles.sendButton}
    >
      <img src={sender} className={styles.sendButton2}/>
    </button>
  </div>
)}
        {/* Render rating input */}
        {responses[currentFieldIndex].type === "rating" && (
          <div>
            
            <div className={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`${styles.ratingButton} ${selectedRating === star ? styles.selected : ""}`}
                  onClick={() => handleRatingChange(star)}
                >
                  {star}
                </button>
              

              ))}
               
               <button
              type="button"
              onClick={handleSendClick}
              className={styles.sendButton}
            >
              <img src={sender} className={styles.sendButton2}/>
            </button>
            </div>
          </div>
        )}

        {/* Render prefilled bubble */}
        {responses[currentFieldIndex].type === "bubble" && (
          <div className={styles.prefilledBubble}>
            <p>{responses[currentFieldIndex].value}</p>
            <button
              type="button"
              onClick={handleSendClick}
              className={styles.nextButton}
            >
              Next
            </button>
          </div>
        )}
      </div>
    )}
  </div>

  {/* Show Submit button only on the last field */}
  {currentFieldIndex === responses.length - 1 && (
    <div className={styles.submitButtonContainer}>
      <button type="submit" onClick={handleSubmit} className={styles.submitButton}>
        Submit Form
      </button>
    </div>
  )}
</div>





</>




  );
};

export default ResponsePage;
