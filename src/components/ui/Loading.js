import React from 'react'

const Loading = () => {
    return (
        <>
            <span className='flex gap-1 h-4  w-12 justify-center  items-center'>
        
                <div className='h-2 w-2 bg-foreground rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                <div className='h-2 w-2 bg-foreground rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                <div className='h-2 w-2 bg-foreground rounded-full animate-bounce'></div>
            </span>
        </>
    )
}

export default Loading
