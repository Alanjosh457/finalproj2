const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
export const register = async (data) => {
    const response = await fetch(`${BACKEND_URL}/api/user/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (response.status === 200 || response.status === 400) {
        return response.json()
    }
    throw new Error('Something went wrong')
}
export const login = async (data) => {
    const response = await fetch(`${BACKEND_URL}/api/user/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (response.status === 200 || response.status === 400) {
        return response.json()
    }
    throw new Error('Something went wrong')
}



export const updateUser = async (data, token) => {
  const response = await fetch(`${BACKEND_URL}/api/user/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Include the token for authentication
    },
    body: JSON.stringify(data),
  });

  if (response.status === 200 || response.status === 400) {
    return response.json(); // Return the parsed JSON response
  }

  throw new Error('Something went wrong');
};
export const createFolder = async (folderName, token) => {
  const response = await fetch(`${BACKEND_URL}/api/folders/create-folder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: folderName }),
  });

  if (response.status === 201) {
    return response.json(); // Return the folder data
  } else if (response.status === 400) {
    return response.json(); // Return error message if any
  }

  throw new Error('Something went wrong');
};

export const createFormbot = async (formbotData, token) => {
  if (!formbotData.name || formbotData.name.trim() === '') {
    throw new Error('Formbot name cannot be empty');
  }

  const response = await fetch(`${BACKEND_URL}/api/folders/create-formbot`, {  // Correct URL here
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formbotData),
  });

  if (response.status === 201) {
    return response.json(); // Return the formbot data
  } else if (response.status === 400) {
    return response.json(); // Return error message if any
  }

  throw new Error(errorData.message ||'Something went wrong');
};
// Fetch the folders of the logged-in user
// Fetch the folders of the logged-in user
export const getFolders = async (token) => {
  const response = await fetch(`${BACKEND_URL}/api/folders/fetchfolders`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data; // assuming the response contains the folders directly
};

// Fetch formbots, either globally or within a specific folder
export const getFormbots = async (token, folderId) => {
  const url = folderId 
    ? `${BACKEND_URL}/api/folders/fetchformbots?folderId=${folderId}` 
    : `${BACKEND_URL}/api/folders/fetchformbots`; // If no folderId, fetch all formbots

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data; // assuming the response contains the formbots directly
};
