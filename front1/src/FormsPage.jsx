import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { uploadImageToCloudinary, saveForm, getForms, updateForm, deleteForm } from "./services";
import flag from './images/flags.png'
import chat from './images/chat.png'
import imgbe from './images/imgbe.png'
import vid from './images/vid.png'
import  gif from './images/gif.png'
import texter from './images/texter.png'
import  hashsym from './images/hashsym.png'
import atsym from './images/atsym.png'
import phone from './images/phone.png'
import cal from './images/cal.png'
import starsym from './images/starsym.png'
import subt from './images/submit.png'
import styles from "./formsPage.module.css";
import  close from './images/close.png'
import  delbun from './images/delebun.png'


const FormsPage = () => {
  const { formbotId, formId } = useParams();
  const [formFields, setFormFields] = useState([]);
  const [formTitle, setFormTitle] = useState("My New Form");
    const [isLightTheme, setIsLightTheme] = useState(true); // Default theme: light
  const navigate = useNavigate();
  const [fieldCounters, setFieldCounters] = useState({
    text: 0,
    phone: 0,
    email: 0,
    number:0,
    bubble: 0,
    image: 0,
    video: 0,
    gif: 0,
    date: 0,
    rating: 0,
  });
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (formbotId) {
      fetchFormsForFormbot(token);
    }

    if (formId) {
      fetchFormData(token);
      console.log('formid',formId)
    }
  }, [formbotId, formId]);

  const fetchFormsForFormbot = async (token) => {
    if (!formbotId) {
      console.error("formbotId is missing");
      return;
    }

    const result = await getForms(token, formbotId);
    if (result.success) {
      const formbotForms = result.forms.filter((form) => form.formbotId === formbotId);
      if (formbotForms.length > 0) {
        const form = formbotForms[0];
        setFormFields(form.fields);
        setFormTitle(form.title);
        console.log("Form fetched from formbot:", form);
      }
    } else {
      console.error("Error fetching forms:", result.message);
    }
  };

  const fetchFormData = async (token) => {
    const result = await getForms(token);
    const form = result.forms.find((f) => f._id === formId);
    if (form) {
      setFormFields(form.fields);
      setFormTitle(form.title);
      console.log("Form fetched by formId:", form);
    }
  };

  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    const token = localStorage.getItem("token");

    const result = await uploadImageToCloudinary(file, token);
    if (result.success) {
      const updatedFields = [...formFields];
      updatedFields[index].value = result.imageUrl;
      setFormFields(updatedFields);
    } else {
      console.error("Error uploading image:", result.message);
    }
  };

  const handleAddField = (type) => {
    const newField = {
      type,
      label: `${capitalizeFirstLetter(type)} Input ${fieldCounters[type] + 1}`,
      value: "",
      sequence: formFields.length + 1,
    };

    const updatedCounters = { ...fieldCounters, [type]: fieldCounters[type] + 1 };
    setFieldCounters(updatedCounters);
    setFormFields([...formFields, newField]);
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };


  const handleRemoveField = (index) => {
    const updatedFields = formFields.filter((_, idx) => idx !== index);
    setFormFields(updatedFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const field of formFields) {
      if (!field.type || !field.label.trim()) {
        alert("Each field must have both a type and a label");
        return;
      }
    }

    const token = localStorage.getItem("token");

    const formData = {
      title: formTitle,
      fields: formFields,
      formbotId: formbotId,
    };

    if (formId) {
      const result = await updateForm(token, formId, formData);
      if (result.success) {
        alert("Form saved successfully!");
        setFormFields(result.updatedForm.fields);
        setFormTitle(result.updatedForm.title);
        fetchFormData(token);
      } else {
        console.error("Error updating form:", result.message);
      }
    } else {
      const result = await saveForm(token, formData);
      if (result.success) {
        alert("Form saved successfully!");
        setFormFields(result.updatedForm.fields);
        setFormTitle(result.updatedForm.title);
        fetchFormsForFormbot(token);
        console.log("Form saved from formbot:", form);
      } else {
        console.error("Error saving form:", result.message);
      }
    }
  };

  const handleDeleteForm = async () => {
    const token = localStorage.getItem("token");

    const result = await deleteForm(token, formId);
    if (result.success) {
      navigate("/");
    } else {
      console.error("Error deleting form:", result.message);
    }
  };

  const toggleTheme = () => {
    setIsLightTheme(!isLightTheme);
    if (!isLightTheme) {
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
    } else {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    }
  };
 
  const closing=()=>{
    navigate('/Home')
  }
  const handleShare = () => {
    const id = formbotId.id || formbotId;  // Extract ID if it's an object
    console.log("Share URL for formbotId:", id);
    
    // Retrieve the token from localStorage
    const token = localStorage.getItem("token");
  
    if (id && token) {
      // Append the token as a query parameter to the URL
      const shareUrl = `${window.location.origin}/#/response/${id}?token=${token}`;
      
      // Copy the share URL to the clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert("Form URL copied to clipboard!");
      });
    } else {
      alert("Form ID or token not found!");
    }
  };
  

  // Sort fields based on the sequence property
  const sortedFields = formFields.sort((a, b) => a.sequence - b.sequence);

  return (
   <>
    <label className={styles.switch}>
    <input
      type="checkbox"
      checked={isLightTheme}
      onChange={toggleTheme}
    />
    <span className={styles.slider}></span>
  </label>
    <div className={`${styles.formbotContainer} ${isLightTheme ? styles.lightMode : styles.darkMode}`}>
    
   <button onClick={closing} className={styles.closebtn2}><img src={close} className={styles.cls3} /></button>
      <div className={styles.mainContent}>
      <div className={styles.sidebar}>
     

  <h3 className={styles.bb}>Bubbles</h3>
  <div className={styles.bubbleCategory}>
    <button className={styles.bubbleButton} onClick={() => handleAddField("bubble")}><img src={chat} className={styles.chat1}/> <span className={styles.buttonText}>
      Text</span></button>
    <button className={styles.bubbleButton} onClick={() => handleAddField("image")}><img src={imgbe} className={styles.chat1}/>
    <span className={styles.buttonText}>Image</span></button>
    <button className={styles.bubbleButton} ><img src={vid} className={styles.chat1}/>
    <span className={styles.buttonText}>Video</span></button>
    <button className={styles.bubbleButton} ><img src={gif} className={styles.gif1}/>
    <div className={styles.gif3}><span className={styles.buttongif}>GIF</span></div></button>
  </div>

  <h3 className={styles.bb}>Inputs</h3>
  <div className={styles.inputCategory}>
    <button className={styles.inputButton} onClick={() => handleAddField("text")}><img src={texter} className={styles.chat1}/>
    <span className={styles.buttonText}>Text</span></button>
    <button className={styles.inputButton} onClick={() => handleAddField("number")}><img src={hashsym} className={styles.chat1}/>
    <span className={styles.buttonText}>Number</span></button>
    <button className={styles.inputButton} onClick={() => handleAddField("phone")}><img src={phone} className={styles.chat1}/>
    <span className={styles.buttonText}> Phone</span></button>
    <button className={styles.inputButton} onClick={() => handleAddField("email")}><img src={atsym} className={styles.chat1}/>
    <span className={styles.buttonText}>Email</span></button>
    <button className={styles.inputButton} onClick={() => handleAddField("date")}><img src={cal} className={styles.chat1}/>
    <span className={styles.buttonText}>  Date</span></button>
    <button className={styles.inputButton} onClick={() => handleAddField("rating")}><img src={starsym} className={styles.chat1}/>
    <span className={styles.buttonText}> Rating</span></button>
    <button className={styles.inputButton2} onClick={() => handleAddField("submit")}><img src={subt} className={styles.sub1}/>
    <div className={styles.sub2}>  <span className={styles.buttonText}> Button</span></div> </button>
  </div>
</div>

<div className={styles.formContainer}>
<div className={styles.startcontainer}>

               <span>  Start</span>  <img src={flag} className={styles.flags2} />
</div>
  <form>
    <input
      type="text"
      value={formTitle}
      onChange={(e) => setFormTitle(e.target.value)}
      placeholder="Enter Form"
      className={styles.formTitle2}
    />
    {sortedFields.map((field, index) => (
      <div key={index} className={styles.formField}>
        {/* Single wrapper div for each field */}
        <div className={styles.blackBox}>
          <div className={styles.flabs}>{field.label}</div>

          {/* Conditionally render field type */}
          {field.type === "text" &&   
          <>
          <input type="text" value={field.value} className={styles.ifs}readOnly />
          <p className={styles.hints}>Hint:User will input a text on his form</p>
          </>  
          }
          {field.type === "phone" && 
           <>
          <input type="tel" value={field.value}  className={styles.ifs} readOnly />
          <p className={styles.hints}>Hint: User will input a numeric value</p>
          </>
          }
        {field.type === "email" && (
        <>
          <input type="email" value={field.value} className={styles.ifs} readOnly />
          <p className={styles.hints}>Hint: User will input an email address</p>
        </>
      )}
      {field.type === "number" && (
        <>
          <input type="tel" value={field.value} className={styles.ifs} readOnly />
          <p className={styles.hints}>Hint: User will input a numeric value</p>
        </>
      )}
      {field.type === "date" && (
        <>
          <div>{field.value}</div>
          <p className={styles.hints}>Hint: User will select a date</p>
        </>
      )}
      {field.type === "rating" && (
        <>
          <div>{field.value}</div>
          <p className={styles.hints}>Hint: User will provide a rating</p>
        </>
      )}

          {/* Bubble input with textarea */}
          {field.type === "bubble" && (
            <textarea
            className={styles.texa}
            placeholder="Click here to edit"
              value={field.value}
              onChange={(e) => {
                const updatedFields = [...formFields];
                updatedFields[index].value = e.target.value;
                setFormFields(updatedFields);
              
              }}
            />
          )}

          {/* Image input */}
          {field.type === "image" && (
            <input type="file" accept="image/*" placeholder="click to add link" onChange={(e) => handleImageUpload(e, index)} className={styles.imf}/>
          )}

          {/* Submit button */}
          {field.type === "submit" && <button type="submit">Submit</button>}

          {/* Delete button */}
          <button type="button" onClick={() => handleRemoveField(index)} className={styles.delbtn}>
        <img src ={delbun} className={styles.delbtn2}/>
          </button>
        </div>
      </div>
    ))}
  </form>

 
</div>

      
          <div className={styles.nav1}>
                <button onClick={handleSubmit} className={styles.savebtn}>Save</button>
                <button onClick={handleShare} className={styles.sharebtn2}>Share</button>
                </div>
            
        </div>
       
      </div>
    </>
  );
};

export default FormsPage;