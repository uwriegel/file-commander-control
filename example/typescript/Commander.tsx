import React, { useState, useRef } from 'react'
import { SplitterGrid } from 'grid-splitter-react'
import { FolderTableItem } from '../../dist/FolderTable'

interface FolderItem extends FolderTableItem {
    index: number
    col2: string
    col3: string
}

type CommanderProps = {
    theme: string
}

export const Commander = ({theme}: CommanderProps) => {
    const [focusedLeft, setFocusedLeft] = useState(false)
    const [pathLeft, setPathLeft] = useState(["", ""])

    const [focusedRight, setFocusedRight] = useState(false)
    const [pathRight, setPathRight] = useState(["", ""])

    return (	
        <SplitterGrid first={<div>Hallo</div>} second={<div>Welt</div>} />
    )
}