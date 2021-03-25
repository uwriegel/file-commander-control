import React from 'react'
import { Commander } from 'file-commander-control'

type CommanderProps = {
    theme: string
}

export const CommanderContainer = ({theme}: CommanderProps) => {
    return <Commander theme={theme}  />
}