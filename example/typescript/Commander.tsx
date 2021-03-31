import React from 'react'
import { Commander, Column, PathInfo, FolderTableItem, TableItem  } from 'file-commander-control'

type DriveItem = {
    name: string,
    description: string,
    driveType: string
}

type FileItem = {
    name: string,
    time: Date,
    size: number
}

type NormalizedPath = {
    path: string,
}

type CommanderProps = {
    theme: string
}

export const CommanderContainer = ({theme}: CommanderProps) => {
    const itemRendererRoot = (item: TableItem) => {
        const tableItem = item as DriveItem
        return [
            <td key={1}>{tableItem.name}</td>,
            <td key={2}>{tableItem.description}</td>,
            <td key={3}>{tableItem.driveType}</td>	
	    ]
    }

    const itemRendererFiles = (item: TableItem) => {
        const tableItem = item as FileItem
        return [
            <td key={1}>{tableItem.name}</td>,
            <td key={2}>{tableItem.time}</td>,
            <td key={3}>{tableItem.size}</td>	
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
                { name: "Name", isSortable: true, subItem: "Erw."}, 
                { name: "Datum", isSortable: true },
                { name: "Größe", isSortable: true }
            ] as Column[]
            : [
                { name: "Beschreibung" }, 
                { name: "Name" }, 
                { name: "Mountpoint" }, 
                { name: "Größe" }, 
            ] as Column[],
            itemRenderer: path != "root" ? itemRendererFiles : itemRendererRoot,
            path 
        }
    }

    const getItems = async (pathInfo: PathInfo) => {
        if (pathInfo.path == "root") {
            const res = await fetch(`http://localhost:3333/root`)
            return await res.json() as DriveItem[]
            
            // description: "sdc1"
            // driveType: "vfat"
            // mountPoint: "/boot/efi"
            // name: "/boot/efi"
            // size: 649068544
            // type: 1
        } else {
            const res = await fetch(`http://localhost:3333/getFiles?path=${pathInfo.path}`)
            return await res.json() as FileItem[]

            // isDirectory: true
            // isHidden: false
            // name: "Bücher"
            // size: 4096
            // time: "2021-02-19T17:43:56.000Z"            
        }
    }
         
    return <Commander theme={theme} getPathInfo={getPathInfo} getItems={getItems} />
}

