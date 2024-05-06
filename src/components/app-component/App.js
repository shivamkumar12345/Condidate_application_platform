import React,{useEffect, useState} from 'react'
import { CircularProgress, OutlinedInput } from '@mui/material'
import "./App.css"
import getData from "../../services/api-service"
import JobCard from '../job-card/JobCard'
import { getValueInRs } from '../../services/filter-service'
import FilterType from '../filter-type/FilterType'
const loadedData =[];
const appliedFilter = new Map();

const App = () => {
  const [jobList,setJobList] = useState([]);
  const [isLoading,setLoading] = useState(true);
  const [error,setError] = useState(""); 
  const [offset, setOffset] = useState(0);
  const [companyName,setCompanyName] = useState("");
 
/**
 * used for api call upon change of offset variable
 */
  useEffect(() => {
    async function fetchData() {
      try{
        const data = await getData(offset);
        loadedData.push(...data)
        onFilterSelect();
        setLoading(false);
      }catch(er){
        setError("Error "+ er.toString());
        setLoading(false);
      }
      
    }
    fetchData();
  }, [offset])
 
//added debounced effect for search functionality
useEffect(()=>{
    const timeoutId = setTimeout(() => {
      onFilterSelect('companyName',companyName);
    }, 500);
    return () => clearTimeout(timeoutId);
  },[companyName])

  /**
 * used for infinite scroll event to change the offset
 */
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

  /**
 * event listner for scroll event
 */
  useEffect(()=>{
      window.addEventListener("scroll",handleScrollEvent);
      return ()=> window.removeEventListener("scroll",handleScrollEvent);
  },[]);

 
  //show loading bar when we open the oage for the first time
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

  /**
 * filter function will get call 
 * for every filter type and selection change
 */
  function onFilterSelect(type,selectedOptions){
   
    appliedFilter.set(type,selectedOptions);

    const filteredList =loadedData.filter(item=>{
      let shouldFilterOut=true;

      appliedFilter.forEach((options,key)=>{
        if(options){
          switch(key){
            case "Min experience":
              if(item['minExp'] && options && Number(item.minExp) >= Number(options.value)){
                shouldFilterOut &=true;
              }else{
                shouldFilterOut =false;
              }
              break;
            
              case "Min base pay":
                const minExpectedSalary = Number(item.minJdSalary) * getValueInRs(item.salaryCurrencyCode);
                if(item['minJdSalary'] && options && minExpectedSalary >= Number(options.value)){
                  shouldFilterOut &=true;
                }else{
                  shouldFilterOut =false;
                }
                break;
              
              case "Job role":
                if(!item['jobRole']){
                  shouldFilterOut =false;
                }else{
                  shouldFilterOut &= options.length==0 || options.filter(filter => item['jobRole'].toLowerCase() === filter.value ).length  >0;
                }
                break;
              
              case "Remote":
              case "location":
                if(!item['location']){
                  shouldFilterOut = false;
                }else{
                  shouldFilterOut &= options.length == 0 || options.filter(filter => item['location'].includes(filter.value) ).length  >0;
                }
              case 'companyName':
                if(!item[key]){
                  shouldFilterOut = false;
                }else{
                  shouldFilterOut &= item[key].toLowerCase().includes(options.toLowerCase());
                }

          }    
        }  
      })
      return shouldFilterOut;
     
    });
    setJobList(filteredList);
}

  return (
    <>
     <div className='filter-container'>
      <FilterType type={"Min experience"} onChange={onFilterSelect}/>
      <FilterType type={"Min base pay"} onChange={onFilterSelect}/>  
      <FilterType type={"Job role"} onChange={onFilterSelect}/>  
      <FilterType type={"Remote"} onChange={onFilterSelect}/>
      <FilterType type={"location"} onChange={onFilterSelect}/>
      <OutlinedInput
            placeholder="Search Company Name" 
            id="company_name"
            value={companyName}
            onChange={(event) => {
              setCompanyName(event.target.value);
            }}
          />
     
    </div>
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