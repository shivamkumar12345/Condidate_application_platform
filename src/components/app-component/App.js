import React,{useEffect, useState} from 'react'
import { CircularProgress } from '@mui/material'
import "./App.css"
import getData from "../../services/api-service"
import JobCard from '../job-card/JobCard'
const loadedData =[];
const App = () => {
  const [jobList,setJobList] = useState([]);
  const [isLoading,setLoading] = useState(true);
  const [error,setError] = useState(""); 
  const [offset, setOffset] = useState(0);
 

  useEffect(() => {
    async function fetchData() {
      try{
        const data = await getData(offset);
        loadedData.push(...data)
        setJobList(loadedData);
        setLoading(false);
      }catch(er){
        setError("Error "+ er.toString());
        setLoading(false);
      }
      
    }
    fetchData();
  }, [offset])


  async function handleScrollEvent(event){
    
    const scrollHeight = document.documentElement.scrollHeight;
    const innerHeight = window.innerHeight;
    const scrollTop=  document.documentElement.scrollTop;

    if(scrollTop + innerHeight + 1 >= scrollHeight){
      setLoading(true);
      setOffset((prev)=> prev + 10);
      setLoading(false);
    }
  }

  useEffect(()=>{
      window.addEventListener("scroll",handleScrollEvent);
      return ()=> window.removeEventListener("scroll",handleScrollEvent);
  },[]);

  
  if(isLoading && jobList.length === 0){
    return <div className='Loading'>
            <CircularProgress />
    </div>
  }
  if(error !== ""){
    return <div className='error-container'>
      {error}
    </div>
  }

  return (
    <>
    <div className='jobList'>
        {jobList && jobList?.map(jobDetail =>{
          return <JobCard key={jobDetail.jdUid} jobDetail={jobDetail}/>
        })
        }
        {isLoading && <div className='Loading'>
            <CircularProgress />
        </div>}
    </div>
    </>
  )
}

export default App