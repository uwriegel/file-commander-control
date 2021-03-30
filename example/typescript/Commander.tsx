import React from 'react'
import { Commander, Column, PathInfo, FolderTableItem, TableItem  } from 'file-commander-control'

type DriveItem = {
    name: string,
    description: string,
    driveType: string
}

type FileItem = {
    name: string,
    description: string,
    driveType: string
}

type NormalizedPath = {
    path: string,
}

type CommanderProps = {
    theme: string
}

export interface FolderItem extends FolderTableItem {
    index: number
    col2: string
    col3: string
}

export const CommanderContainer = ({theme}: CommanderProps) => {

    // TODO: ItemRenderer in pathInfo
    const itemRenderer = (item: TableItem) => {
        const tableItem = item as FolderItem
        return [
            <td key={1}>{tableItem.name}</td>,
            <td key={2}>{tableItem.col2}</td>,
            <td key={3}>{tableItem.col3}</td>	
	    ]
    }

    const getPathInfo = async (path: string | null) => {
        path = path ? path : "root"
        if (path != "root") {
            const resPath = await fetch(`http://localhost:3333/normalize?path=${path}`)
            path = (await resPath.json() as NormalizedPath).path
        }
        return { 
            columns: path != "root" 
            ? [
                { name: "Name", isSortable: true }, 
                { name: "Erw.", isSortable: true, subItem: true }, 
                { name: "Letzte Spalte", isSortable: true }
            ] as Column[]
            : [
                { name: "Beschreibung" }, 
                { name: "Name" }, 
                { name: "Mountpoint" }, 
                { name: "Größe" }, 
            ] as Column[],
            path 
        }
    }

    const getItems = async (pathInfo: PathInfo) => {
        if (pathInfo.path == "root") {
            const res = await fetch(`http://localhost:3333/root`)
            const items = await res.json() as DriveItem[]
            return items.map(n => ({name: n.name, col2: n.description, col3: n.driveType }))
        } else {
            const res = await fetch(`http://localhost:3333/getFiles?path=${pathInfo.path}`)
            const items = await res.json() as FileItem[]
            console.log(items)
            return items.map(n => ({name: n.name, col2: "n.description", col3: "n.driveType" }))
        }
    }
         
    return <Commander theme={theme} getPathInfo={getPathInfo} getItems={getItems} itemRenderer={itemRenderer} />
}

