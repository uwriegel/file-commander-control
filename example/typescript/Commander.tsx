import React, { useState, useRef } from 'react'
import { SplitterGrid } from 'grid-splitter-react'

type CommanderProps = {
    theme: string
}

export const Commander = ({theme}: CommanderProps) => {
    return (	
        <SplitterGrid first={<div>Hallo</div>} second={<div>Welt</div>} />
    )
}