import React from 'react';
import { useSelector } from 'react-redux';
import Spinner from '../../components/Spinner';
import CardOptions from './CardOptions';

const ClinicSettings = () => {
    const loading = useSelector((state) => state.clinicSettings.loading);
    return (
        <div className="p-7 ">
            <h2 className="text-lg font-semibold mb-6">Clinic Settings</h2>
            {loading ? ( // Conditional rendering for loading spinner
                <Spinner /> // Use Spinner component
                ) : (<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                    <CardOptions choice={'diagnoses'}/>
                    <CardOptions choice={'jobs'}/>
                    <CardOptions choice={'medicines'}/>
                    </div>
                )}
        </div>
    );
};

export default ClinicSettings;
