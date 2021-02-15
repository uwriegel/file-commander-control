import React from 'react'
import { FolderTable } from 'file-commander-control'

type FolderTestProps = {
    theme: string
}
export const FolderTest = ({theme}: FolderTestProps) => {
    return (	
        <FolderTable theme={theme} /> 
	)
}
