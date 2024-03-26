import { useEffect, useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

import './permission.scss'

export default function Permission({fallback}: {fallback: string | null}) {
    const [countdown, setCountdown] = useState(4)
    const navigate = useNavigate();
    
    // countdown kick to homepage
    useEffect(() => {
        const kick = setTimeout(() => {
            navigate('/')
        }, countdown * 1000);

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev > 1) {
                    message.warning(`You will be redirected to the homepage in ${prev - 1} seconds.`, 0);
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearTimeout(kick);
            clearInterval(timer);
            message.destroy();
        }
    }, []);

    return (
        <div className="permission">
            <div>
                <p className='access'>
                    <code>Access Denied</code>
                </p>
                <hr />
                <p className='title-access'>
                    You don't have permission to view this site.
                </p>
                <p className='icon'>🚫🚫🚫🚫</p>
                <p className='err'>error code:403 forbidden</p>
            </div>
        </div>
    )
}
