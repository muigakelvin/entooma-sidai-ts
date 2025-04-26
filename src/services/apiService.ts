import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/forms";

// Function to submit the AddFormDialog data
export const submitAddFormDialog = async (formData: FormData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/add-form-dialog`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Set Content-Type to multipart/form-data
        },
      }
    );
    console.log("Response from server:", response.data); // Log the server response
    return response.data;
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
};

// Function to submit the RepresentativeForm data
export const submitRepresentativeForm = async (formData: FormData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/representative-form`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Set Content-Type to multipart/form-data
        },
      }
    );
    console.log("Response from server:", response.data); // Log the server response
    return response.data;
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
};
