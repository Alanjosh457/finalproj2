import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // To fetch formbotId from the URL
import { getAllResponses } from './services'; // API call function
import { Doughnut } from 'react-chartjs-2'; // Doughnut chart component
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'; // Chart.js modules
import styles from './display.module.css'; // CSS module
import lines from './images/lines.png'

ChartJS.register(ArcElement, Tooltip, Legend);

const DisplayAllResponses = () => {
  const { formbotId } = useParams(); // Extract formbotId from the route
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState('');
  const [viewCount, setViewCount] = useState(0); // State to store total view count
  const [startCount, setStartCount] = useState(1); // State to store the incremented starts count
  const [completedCount, setCompletedCount] = useState(0); // State for completed count
  const [nonCompletedCount, setNonCompletedCount] = useState(0); // State for non-completed count
  const [chartData, setChartData] = useState(null); // State for donut chart data
    const [isLightTheme, setIsLightTheme] = useState(true); // Default theme: light

 useEffect(() => {
    // Apply body background class
    document.body.classList.add(styles.bodyBackground);

    // Cleanup the body class when the component unmounts
    return () => {
      document.body.classList.remove(styles.bodyBackground);
    };
  }, []);

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
  useEffect(() => {
    const fetchResponses = async () => {
      if (!formbotId) {
        setError('No Formbot ID provided.');
        return;
      }

      try {
        const data = await getAllResponses(formbotId); // Fetch data for the specific formbotId
        console.log(data); // Log the entire API response

        if (data && data.length > 0) {
          setResponses((prev) => {
            const newResponses = data || [];
            const uniqueResponses = [
              ...new Map([...prev, ...newResponses].map((item) => [item._id, item])).values(),
            ];
            return uniqueResponses;
          });
          
       

          // Calculate total views
          const totalViews = data.reduce((acc, response) => acc + response.views, 1);
          setViewCount(totalViews); // Set the total view count

          // Calculate total starts
          const totalStarts = data.reduce((acc, response) => acc + response.starts,1);
          setStartCount(totalStarts); // Set the total starts count

          // Calculate completed and non-completed responses
          const totalCompleted = data.filter(response => response.completed).length;
          const totalNonCompleted = data.filter(response => !response.completed).length;

          setCompletedCount(totalCompleted); // Set the completed responses count
          setNonCompletedCount(totalNonCompleted); // Set the non-completed responses count

          // Prepare data for the donut chart
          setChartData({
            labels: ['Completed Responses', 'Non-Completed Responses'],
            datasets: [
              {
                label: 'Responses',
                data: [totalCompleted, totalNonCompleted],
                backgroundColor: ['', '#3B82F6'], // Green for completed, Red for non-completed
                hoverBackgroundColor: ['#45a049', '#e05c5c'],
                cutout: '70%', // Inner radius percentage to create the donut effect
              },
            ],
          });
        }
      } catch (err) {
        setError('Error fetching responses.');
      }
    };

    fetchResponses();
  }, [formbotId]);

  const getTableHeaders = () => {
    if (!responses.length) return [];
    const firstResponse = responses[0];

    const headers = firstResponse.fields.map((field) => field.label);
    return ['Submitted At', ...headers];
  };

  const getFieldValues = (response) => {
    const submittedAt = new Date(response.createdAt).toLocaleString();
    const values = response.fields.map((field) => field.value);
    return [submittedAt, ...values];
  };

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
   <div className={styles.container}>
  {error && <p className={styles.errorMessage}>{error}</p>}


  {responses.length > 0 ? (
    <>
 <div className={styles.startsSection}>

  
 <div className={styles.recd}>
  <ul className={styles.redd}>
    <li className={styles.viewCount}> <p className={styles.vi}>Views</p> <p className={styles.views1}>{viewCount}</p></li>
    <li className={styles.startsHeading}><p className={styles.st}>Starts</p> <p className={styles.views1} >{startCount}</p></li>
  </ul>
  </div>

      {/* Display the total view count */}
     
        <div className={styles.startsItem}></div>
      </div>

      {/* Display the total completed responses */}
      <div className={styles.completedSection}>
        <div className={styles.completedItem}></div>
      </div>

      {/* Display the total non-completed responses */}
      <div className={styles.completedSection}>
        <div className={styles.completedItem}></div>
      </div>


   



      {/* Display responses table */}
      <table className={styles.table}>
        <thead>
          <tr>
            {getTableHeaders().map((header, index) => (
              <th key={index} className={styles.th}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {responses.map((response, index) => (
            <tr key={response._id || index} className={styles.tr}>
              {getFieldValues(response).map((value, i) => (
                <td key={i} className={styles.td}>
                  {value || 'Null'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Display the donut chart */}
      {chartData && (
        <div className={styles.chartContainer}>
          <h3>Response Status</h3>

        
          <Doughnut data={chartData} className={styles.charts} />
        </div>
      )}

<div className={styles.cort}>
      <h3 className={styles.cc1}>Completed</h3> 
      <p className={styles.ccp}>{completedCount}</p>
      </div>

      <div className={styles.cort2}>
      <h3 className={styles.cc2}>Completion rate</h3> 
      <p className={styles.ccp2}>{completedCount}</p>
      </div>
    
<div className={styles.liners}> 
   <p className={styles.bars}>Scroll bar if columns are more</p><img src={lines} className={styles.lin}/></div>

    </>
  ) : (
    // Display this message if there are no responses
    <h1 className={styles.noResponses}>No responses yet collected.</h1>
  )}
</div>
</>
  )
};

export default DisplayAllResponses;
