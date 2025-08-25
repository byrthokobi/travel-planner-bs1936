'use client'

import React, { useState } from 'react'
const AboutPage = () => {
    const [count, setCount] = useState(0);

    return (
        <div className='font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20'>
            <h1>About Page</h1>
            <h2> Working on a different subject</h2>
            <p>Clicled {count} times</p>
            <button style={{ backgroundColor: "Blue", padding: "1rem", borderRadius: "10px" }} onClick={() => setCount(count + 1)}>Click!</button>
        </div>
    )
}
export default AboutPage;
