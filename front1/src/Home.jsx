import React, { useContext, useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { IoIosArrowDown } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import { createFolder, createFormbot, getFolders, getFormbots } from './services';
import styles from './home.module.css';
import fol from './images/fol.png';

const Home = () => {
  const { user, setUser } = useContext(UserContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isFormbotModalOpen, setIsFormbotModalOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folderData, setFolderData] = useState({});
  const [globalFormbots, setGlobalFormbots] = useState([]);
  const [newFormbotName, setNewFormbotName] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to access folders and formbots.');
        return;
      }

      try {
        const decoded = jwtDecode(token);
        setUser({ name: decoded.name, email: decoded.email });

        const fetchedFolders = await getFolders(token);
        setFolders(fetchedFolders);

        const initialFolderData = {};
        fetchedFolders.forEach((folder) => {
          initialFolderData[folder._id] = folder.formbots || [];
        });
        setFolderData(initialFolderData);

        const fetchedGlobalFormbots = await getFormbots(token, null);
        setGlobalFormbots(fetchedGlobalFormbots);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [setUser]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleFolderInputChange = (event) => {
    setNewFolderName(event.target.value);
  };

  const handleFormbotInputChange = (event) => {
    setNewFormbotName(event.target.value);
  };

  const handleCreateFolder = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to create a folder.');
        return;
      }

      const folder = await createFolder(newFolderName, token);
      setFolders([...folders, folder]);
      setFolderData({ ...folderData, [folder._id]: [] });
      setNewFolderName('');
      setIsFolderModalOpen(false);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleCreateFormbot = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to create a formbot.');
        return;
      }

      const formbotData = { name: newFormbotName, folderId: selectedFolder };
      const formbot = await createFormbot(formbotData, token);

      if (selectedFolder) {
        setFolderData({
          ...folderData,
          [selectedFolder]: [...(folderData[selectedFolder] || []), formbot],
        });
      } else {
        setGlobalFormbots([...globalFormbots, formbot]);
      }

      setNewFormbotName('');
      setIsFormbotModalOpen(false);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleFolderClick = (folderId) => {
    setSelectedFolder(folderId);
  };

  // Update goForm to accept formbotId as a parameter
  const goForm = (formbotId) => {
    navigate(`/forms/${formbotId}`); // Navigate to the formbot's page
  };

  return (
    <>
      <center>
        <div>
          <header className={styles.hdr} onClick={toggleDropdown}>
            <div>
              {user.name ? user.name : 'Guest'}'s workspace
              <IoIosArrowDown className={styles.arrow} />
            </div>
          </header>

          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <ul>
                <li>
                  <Link to="/settings">Settings</Link>
                </li>
                <li>
                  <Link to="/">Logout</Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </center>

      <div className={styles.crf1}>
        <button className={styles.crf} onClick={() => setIsFolderModalOpen(true)}>
          <img src={fol} className={styles.fol1} alt="folder" />
          <p className={styles.cf}>Create a folder</p>
        </button>
        <button className={styles.ctp} onClick={() => setIsFormbotModalOpen(true)}>
          <p className={styles.pl}>+</p> <p className={styles.tp}>Create a Formbot</p>
        </button>
      </div>

      {isFolderModalOpen && (
        <div className={styles.overlay}>
          <div className={styles.popup}>
            <h2>Create New Folder</h2>
            <input
              className={styles.input}
              type="text"
              value={newFolderName}
              onChange={handleFolderInputChange}
              placeholder="Enter folder name"
            />
            <div className={styles.actions}>
              <button className={styles.done} onClick={handleCreateFolder}>
                Done
              </button>
              <button className={styles.cancel} onClick={() => setIsFolderModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isFormbotModalOpen && (
        <div className={styles.overlay}>
          <div className={styles.popup}>
            <h2>Create New Formbot</h2>
            <input
              className={styles.input}
              type="text"
              value={newFormbotName}
              onChange={handleFormbotInputChange}
              placeholder="Enter Formbot name"
            />
            <div className={styles.actions}>
              <button className={styles.done} onClick={handleCreateFormbot}>
                Done
              </button>
              <button className={styles.cancel} onClick={() => setIsFormbotModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.folderContainer}>
        {folders.map((folder) => (
          <button
            key={folder._id}
            className={`${styles.folderButton} ${selectedFolder === folder._id ? styles.selectedFolder : ''}`}
            onClick={() => handleFolderClick(folder._id)}
          >
            {folder?.name || 'No name'}
          </button>
        ))}
      </div>

      {!selectedFolder && globalFormbots.length > 0 && (
        <div className={styles.globalFormbotContainer}>
          <div className={styles.formbotList}>
            {globalFormbots.map((formbot) => (
              <div key={formbot._id} className={styles.formbotItem} onClick={() => goForm(formbot._id)}>
                {formbot.name || 'Unnamed Formbot'}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedFolder && (
        <div className={styles.folderActions}>
          <div className={styles.formbotList}>
            {(folderData[selectedFolder] || []).map((formbot) => (
              <div key={formbot._id} className={styles.formbotItem} onClick={() => goForm(formbot._id)}>
                {formbot.name || 'Unnamed Formbot'}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
