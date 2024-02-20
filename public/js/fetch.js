const apiUrl = 'http://localhost:8000/izvoare';

export const fetchData = async () => {
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return null; 
  }
};

