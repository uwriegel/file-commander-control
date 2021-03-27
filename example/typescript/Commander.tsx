import React from 'react'
import { Commander } from 'file-commander-control'
import { FolderTableItem } from '../../dist/FolderTable'
import { TableItem } from 'virtual-table-react'

type CommanderProps = {
    theme: string
}

export interface FolderItem extends FolderTableItem {
    index: number
    col2: string
    col3: string
}

export const CommanderContainer = ({theme}: CommanderProps) => {

    const itemRenderer = (item: TableItem) => {
        const tableItem = item as FolderItem
        return [
            <td key={1}>{tableItem.name}</td>,
            <td key={2}>{tableItem.col2}</td>,
            <td key={3}>{tableItem.col3}</td>	
	    ]
    }

    const getPathInfo = (path: string) => ({
        columns: [
            { name: "Eine Spalte", isSortable: true }, 
            { name: "Zweite. Spalte" }, 
            { name: "Letzte Spalte", isSortable: true }
        ],
        path
    })
    
    const getItems = (path: string) => new Promise<FolderTableItem[]>((res, rej) => {
        const items = Array.from(Array(6000).keys()).map(index => ({ name: `Name ${index}`, col2: `Adresse ${index}`, col3: `Größe ${index}`, index: index} as FolderItem))
        setTimeout(() => res(items), 300)
    })
         
    return <Commander theme={theme} getPathInfo={getPathInfo} getItems={getItems} itemRenderer={itemRenderer} />
}

