import React, { useState, useRef } from "react";

const ThoughtForm = () => {
  const [formState, setFormState] = useState({
    username: "",
    thought: "",
  });
  const [characterCount, setCharacterCount] = useState(0);

  // initial value to null so that reference to the DOM element is current
  const fileInput = useRef(null);

  // update state based on form input changes
  const handleChange = (event) => {
    if (event.target.value.length <= 280) {
      setFormState({ ...formState, [event.target.name]: event.target.value });
      setCharacterCount(event.target.value.length);
    }
  };

  // submit form
  const handleFormSubmit = (event) => {
    event.preventDefault();

    // send request to API to create new thought
    const postData = async () => {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });
      const data = await res.json();
      console.log(data);
    };
    postData();

    // clear form value
    setFormState({ username: "", thought: "" });
    setCharacterCount(0);
  };

  // function retrieves image file uploaded by user and sends data in request to endpoint
  const handleImageUpload = (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append('image', fileInput.current.files[0]);
    // send image file to endpoint with the postImage function
    const postImage = async () => {
      try {
        const res = await fetch('/api/image-upload', {
          mode: 'cors',
          method: 'POST',
          body: data,
        });
        if (!res.ok) throw new Error(res.statusText);
        const postResponse = await res.json();
        setFormState({ ...formState, image: postResponse.Location });
    
        return postResponse.Location;
      } catch (error) {
        console.log(error);
      }
    };
    postImage();
  };

  return (
    <div>
      <p className={`m-0 ${characterCount === 280 ? "text-error" : ""}`}>
        Character Count: {characterCount}/280
      </p>
      <form
        className="flex-row justify-center justify-space-between-md align-stretch"
        onSubmit={handleFormSubmit}
      >
        <input
          placeholder="Name"
          name="username"
          value={formState.username}
          className="form-input col-12 "
          onChange={handleChange}
        ></input>
        <textarea
          placeholder="Here's a new thought..."
          name="thought"
          value={formState.thought}
          className="form-input col-12 "
          onChange={handleChange}
        ></textarea>
        <label className="form-input col-12  p-1">
          Add an image to your thought:
          <input type="file" ref={fileInput} className="form-input p-2" />
          <button className="btn" onClick={handleImageUpload} type="submit">
            Upload
          </button>
        </label>
        <button className="btn col-12 " type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ThoughtForm;


// IMAGE UPLOAD INPUT EXPLAINED
// The <input> type is file. With this designation, HTML can browse and add files from your computer.

// The ref attribute is assigned to the fileInput. We'll define this function using a React Hook name, useRef.

// We'll also need to define the handleImageUpload function. This function will send the image to the image upload endpoint we created.

// IMPORTANT
// Because the image upload process to S3 is an asynchronous request that will take some time, it's possible to submit the form before the response from the image upload process is returned. This will submit a null as the value of the image URL. To prevent this, we can add a progress bar or disable the form submit button while the image is processing. However, because this is beyond the scope of this lesson, we will not attempt to add this feature.