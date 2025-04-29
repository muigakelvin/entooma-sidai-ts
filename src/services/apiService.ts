import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/forms";

/**
 * Submit AddFormDialog data to the backend.
 * @param formData - FormData object containing form fields and files.
 * @returns The server response data.
 */
export const submitAddFormDialog = async (formData: FormData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/add-form-dialog`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      }
    );
    console.log("Response from server (AddFormDialog):", response.data);
    return response.data;
  } catch (error) {
    console.error("Error submitting AddFormDialog:", error);
    throw error; // Re-throw the error for handling in the calling function
  }
};

/**
 * Partially update an existing AddFormDialog record.
 * @param id - The ID of the record to update.
 * @param formData - FormData object containing updated form fields and files.
 * @returns The server response data.
 */
export const submitUpdateAddFormDialog = async (
  id: number | string,
  formData: FormData
) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/add-form-dialog/${id}`, // Use PATCH for partial updates
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      }
    );
    console.log(
      "Response from server (Partial Update AddFormDialog):",
      response.data
    );
    return response.data;
  } catch (error) {
    console.error("Error partially updating AddFormDialog:", error);
    throw error; // Re-throw the error for handling in the calling function
  }
};

/**
 * Submit RepresentativeForm data to the backend.
 * @param formData - FormData object containing form fields and files.
 * @returns The server response data.
 */
export const submitRepresentativeForm = async (formData: FormData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/representative-form`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      }
    );
    console.log("Response from server (RepresentativeForm):", response.data);
    return response.data;
  } catch (error) {
    console.error("Error submitting RepresentativeForm:", error);
    throw error; // Re-throw the error for handling in the calling function
  }
};

/**
 * Partially update an existing RepresentativeForm record.
 * @param id - The ID of the record to update.
 * @param formData - FormData object containing updated form fields and files.
 * @returns The server response data.
 */
export const submitUpdateRepresentativeForm = async (
  id: number | string,
  formData: FormData
) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/representative-form/${id}`, // Use PATCH for partial updates
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      }
    );
    console.log(
      "Response from server (Partial Update RepresentativeForm):",
      response.data
    );
    return response.data;
  } catch (error) {
    console.error("Error partially updating RepresentativeForm:", error);
    throw error; // Re-throw the error for handling in the calling function
  }
};

/**
 * Fetch all records from the backend.
 * @returns A list of all records.
 */
export const fetchAllRecords = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/all`);
    console.log("Fetched all records:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching all records:", error);
    throw error; // Re-throw the error for handling in the calling function
  }
};

/**
 * Fetch a single record by its ID.
 * @param id - The ID of the record to fetch.
 * @returns The record data.
 */
export const fetchRecordById = async (id: number | string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    console.log(`Fetched record with ID ${id}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching record with ID ${id}:`, error);
    throw error; // Re-throw the error for handling in the calling function
  }
};

/**
 * Delete a record by its ID.
 * @param id - The ID of the record to delete.
 * @returns The server response data.
 */
export const deleteRecord = async (id: number | string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    console.log(`Deleted record with ID ${id}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error deleting record with ID ${id}:`, error);
    throw error; // Re-throw the error for handling in the calling function
  }
};
