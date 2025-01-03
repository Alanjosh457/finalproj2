import React, { useContext, useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from 'react-icons/io';
import { UserContext } from './UserContext';
import {
  createFolder,
  createFormbot,
  getFolders,
  getFormbots,
  sharespace,
  getspace,
} from './services';
import styles from './home.module.css';
import fol from './images/fol.png';
import folb from './images/folb.png';
import delt from './images/delbun2.png';


const Home = () => {
  const { workspaceId } = useParams();
  const { user, setUser } = useContext(UserContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isFormbotModalOpen, setIsFormbotModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const [formbotToDelete, setFormbotToDelete] = useState(null);
  const [isFormbotDeleteModalOpen, setIsFormbotDeleteModalOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folderData, setFolderData] = useState({});
  const [globalFormbots, setGlobalFormbots] = useState([]);
  const [newFormbotName, setNewFormbotName] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareMode, setShareMode] = useState('edit');
  const [shareEmail, setShareEmail] = useState('');
  const [sharedWorkspaces, setSharedWorkspaces] = useState([]);
  const [isLightTheme, setIsLightTheme] = useState(true); // Default theme: light


  const navigate = useNavigate();



  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to access this feature.');
        return;
      }

      try {
        const decoded = jwtDecode(token);
        setUser({ name: decoded.name, email: decoded.email, _id: decoded._id });

        const fetchedFolders = await getFolders(token);
        setFolders(fetchedFolders);

        const initialFolderData = {};
        fetchedFolders.forEach((folder) => {
          initialFolderData[folder._id] = folder.formbots || [];
        });
        setFolderData(initialFolderData);

        const fetchedGlobalFormbots = await getFormbots(token, null);
        setGlobalFormbots(fetchedGlobalFormbots);

        console.log('Fetched folder data:', initialFolderData);
        console.log('Fetched global formbots:', fetchedGlobalFormbots);

        const sharedWorkspacesData = await getspace(workspaceId);
        if (sharedWorkspacesData?.sharedWithUser) {
          setSharedWorkspaces(sharedWorkspacesData.sharedWithUser);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [workspaceId, setUser]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleCreateFolder = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to create a folder.');
        return;
      }

      const folder = await createFolder(newFolderName, token);
      setFolders((prev) => [...prev, folder]);
      setFolderData((prev) => ({ ...prev, [folder._id]: [] }));
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
        setFolderData((prev) => ({
          ...prev,
          [selectedFolder]: [...(prev[selectedFolder] || []), formbot],
        }));
      } else {
        setGlobalFormbots((prev) => [...prev, formbot]);
      }

      setNewFormbotName('');
      setIsFormbotModalOpen(false);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const openDeleteModal = (folderId) => {
    setFolderToDelete(folderId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setFolderToDelete(null);
  };

  const confirmDeleteFolder = () => {
    setFolders((prev) => prev.filter((folder) => folder._id !== folderToDelete));
    const { [folderToDelete]: _, ...remainingFolders } = folderData;
    setFolderData(remainingFolders);
    closeDeleteModal();
  };

  const openFormbotDeleteModal = (formbotId, folderId) => {
    setFormbotToDelete({ id: formbotId, folderId });
    setIsFormbotDeleteModalOpen(true);
  };

  const closeFormbotDeleteModal = () => {
    setIsFormbotDeleteModalOpen(false);
    setFormbotToDelete(null);
  };

  const confirmDeleteFormbot = () => {
    if (formbotToDelete.folderId) {
      // Deleting from a folder
      setFolderData((prev) => ({
        ...prev,
        [formbotToDelete.folderId]: prev[formbotToDelete.folderId].filter(
          (formbot) => formbot._id !== formbotToDelete.id
        ),
      }));
    } else {
      // Deleting from global formbots
      setGlobalFormbots((prev) =>
        prev.filter((formbot) => formbot._id !== formbotToDelete.id)
      );
    }
    closeFormbotDeleteModal();
  };

  const handleShareWorkspace = async () => {
    try {
      const response = await sharespace(shareEmail, workspaceId, shareMode);
      setIsShareModalOpen(false);
      setShareEmail('');
      alert('Workspace shared successfully!');
    } catch (error) {
      alert('Error sharing workspace. Please try again.');
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
  const handleFolderClick = (folderId) => setSelectedFolder(folderId);

  const goForm = (formbotId) => navigate(`/forms/${formbotId}`);

  return (
    <>
      <header className={`${styles.hdr} ${styles.headerWithBorder}`}>
        <div className={styles.userDropdown} onClick={toggleDropdown}>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={isLightTheme}
            onChange={toggleTheme}
          />
          <span className={styles.slider}></span>
        </label>
          <div className={styles.username}>
            {user.name ? `${user.name}'s Workspace` : 'Guest Workspace'}
            <IoIosArrowDown className={styles.arrow} />
          </div>
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
      
      </header>

      <div className={styles.crf1}>
        <button className={styles.crf} onClick={() => setIsFolderModalOpen(true)}>
          <img src={folb} className={styles.folb22} />
        </button>
      </div>

      <div>
        <button className={styles.ctp} onClick={() => setIsFormbotModalOpen(true)}>
          <p className={styles.plus}>+</p>
          <p className={styles.fmbt}>Create a Formbot</p>
        </button>
      </div>

      {isFolderModalOpen && (
        <div className={styles.overlay}>
          <div className={styles.popup}>
            <h2 className={styles.h22}>Create New Folder</h2>
            <input
              className={styles.input}
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
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
            <h2 className={styles.h33}>Create New Formbot</h2>
            <input
              className={styles.input}
              type="text"
              value={newFormbotName}
              onChange={(e) => setNewFormbotName(e.target.value)}
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
    <div key={folder._id} className={styles.folderWrapper}>
      <button
        className={`${styles.folderButton} ${selectedFolder === folder._id ? styles.selectedFolder : ''}`}
        onClick={() => handleFolderClick(folder._id)}
      >
        {folder.name || 'Unnamed Folder'}
      </button>
      <button className={styles.deleteButton} onClick={() => openDeleteModal(folder._id)}>
        <span className={styles.deleteButtonIcon}>
          <img src={delt} alt="Delete" />
        </span>
      </button>

      {/* Render Formbots inside the folder */}
      {selectedFolder === folder._id && folderData[folder._id] && folderData[folder._id].length > 0 && (
        <div className={styles.formbotList}>
          {folderData[folder._id].map((formbot) => (
            <div key={formbot._id} className={styles.formbotItem} onClick={() => goForm(formbot._id)}>
              <p >{formbot.name || 'Unnamed Formbot'}</p>
              <button
                className={styles.deleteButton}
                onClick={() => openFormbotDeleteModal(formbot._id, folder._id)}
              >
                <span className={styles.deleteButtonIcon}>
                  <img src={delt} alt="Delete Formbot" />
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  ))}
</div>


      {!selectedFolder && globalFormbots.length > 0 && (
        <div className={styles.globalFormbotContainer}>
          {globalFormbots.map((formbot) => (
            <div key={formbot._id} className={styles.formbotWrapper}>
              <div className={styles.formbotItem} onClick={() => goForm(formbot._id)}>
                {formbot.name || 'Unnamed Formbot'}
              </div>
              <button
                className={styles.deleteButton}
                onClick={() => openFormbotDeleteModal(formbot._id, null)}
              >
                <span className={styles.deleteButtonIcon}><img src={delt} /></span>
              </button>
            </div>
          ))}
        </div>
      )}

      {isDeleteModalOpen && (
        <div className={styles.overlay}>
          <div className={styles.popup}>
            <h2 className={styles.h44}>Are you sure you want to delete this folder?</h2>
            <div className={styles.actions}>
              <button className={styles.done} onClick={confirmDeleteFolder}>
           CONFIRM
              </button>
              <button className={styles.cancel} onClick={closeDeleteModal}>
              CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {isFormbotDeleteModalOpen && (
        <div className={styles.overlay}>
          <div className={styles.popup}>
            <h2 className={styles.h55}>Are you sure you want to delete this Formbot?</h2>
            <div className={styles.actions}>
              <button className={styles.done} onClick={confirmDeleteFormbot}>
            CONFIRM
              </button>
              <button className={styles.cancel} onClick={closeFormbotDeleteModal}>
            CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
