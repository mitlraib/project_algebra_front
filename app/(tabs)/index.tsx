//Index

import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

export default function Index() {
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsReady(true);
        }, 100); // מחכים טיפה כדי לוודא שהכל נטען

        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (isReady) {
            router.replace('/Dashboard');
        }
    }, [isReady]);

    return null;
}
//end of Index
