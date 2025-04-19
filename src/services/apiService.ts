// import axios from "axios";

// const API_BASE_URL = "http://localhost:8080/api/forms";

// export const submitRepresentativeForm = async (formData: any) => {
//   try {
//     const response = await axios.post(
//       `${API_BASE_URL}/representative-form`,
//       formData,
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     console.log("Response from server:", response.data); // Log the server response
//     return response.data;
//   } catch (error) {
//     console.error("Error submitting form:", error);
//     throw error;
//   }
// };

import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/forms";

// Function to submit the AddFormDialog data
export const submitAddFormDialog = async (formData: any) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/add-form-dialog`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
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

// Existing function for RepresentativeForm
export const submitRepresentativeForm = async (formData: any) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/representative-form`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
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
