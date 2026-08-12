import { useState } from 'react'
function Popup({ Open, onClose, children }) {
    if (!Open) return null;

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-10'>
            <div className='bg-white rounded-md'>
                <div className='flex justify-end'>
            <button className ='border rounded-md m-2 p-2 py-1 bg-[rgba(0,0,0,0.2)]' onClick={onClose}>Close</button> 
                </div>
            <div className='m-4'>
                {children}
            </div>
            </div>
        </div>
    );
}

export default Popup;