import axios from 'axios';

const BASE_URL = "https://65e178bfa8583365b31672f8.mockapi.io";

// Function to get all toys
export const getAllToys = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/ListOfToys`);
    return response.data;
  } catch (error) {
    console.error('Error fetching toys:', error);
    throw error;
  }
};

// Function to get a toy by ID (for Detail.js)
export const getToyById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/ListOfToys/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching toy by id:', error);
    throw error;
  }
};
