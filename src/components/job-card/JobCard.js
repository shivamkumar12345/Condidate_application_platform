import React from 'react'
import "./JobCard.css"
import { Button } from '@mui/material'
import BoltIcon from '@mui/icons-material/Bolt';
const JobCard = (props) => {
    const {
        jobDetailsFromCompany,
        jobRole,
        location,
        maxExp,
        maxJdSalary,
        minExp,
        minJdSalary,
        salaryCurrencyCode,
        companyName,
        logoUrl} =props.jobDetail;
    


  return (<>
    <div className='card-container'>
        <div className='card-header'>
            <img src={logoUrl} alt="logo"/>
            <div className='items'>
                {companyName && <h3>{companyName}</h3>}
                {jobRole && <h2>{jobRole}</h2>}
                {location && <h4>{location}</h4>}
            </div>
        </div>

        {jobDetailsFromCompany && 
        <div className='card-body'>
            <h3>Job description</h3>
            <p>{jobDetailsFromCompany.substring(0,300)}</p>
            <div>
                <a >Show more</a>
            </div>
        </div>}

        <div className='card-footer'>
           {minExp && <> 
            <h3>Minimum Experience</h3>
            <h4>{minExp} years</h4>
            </>
            }
            <Button variant="contained" color='success' startIcon={<BoltIcon  color='warning'/>}>
                Easy apply
            </Button>
        </div>
    </div>

   
  </>
  )
}

export default JobCard