import React, { Suspense } from 'react';

const layout = ({children}) => {
    return (
        <Suspense  fallback={<div>loading</div>} >
            {children}
        </Suspense>
    );
};

export default layout;