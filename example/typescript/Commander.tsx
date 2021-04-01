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
            <td key={1}>
                <svg className="svg" viewBox="0 0 72 72">
                    <path className="path" d="M 9.0948483,47.713174 C 7.5739523,47.022416 6.5386022,45.82351 6.0580771,44.196672 5.8448112,43.474653 5.7546758,40.255072 5.8182131,35.628902 L 5.92,28.217804 6.9139274,26.988902 C 7.4605872,26.313006 8.3965872,25.472 8.9939274,25.12 10.055591,24.494384 10.655357,24.48 35.68,24.48 c 25.024643,0 25.62441,0.01438 26.686074,0.64 0.597337,0.352 1.533337,1.193006 2.08,1.868902 l 0.993926,1.228902 0.101786,7.411098 c 0.06354,4.62617 -0.02659,7.845751 -0.239863,8.56777 -0.480525,1.626838 -1.515875,2.825744 -3.036771,3.516502 -1.235226,0.561012 -2.659603,0.592772 -26.585152,0.592772 -23.925549,0 -25.349927,-0.03174 -26.5851517,-0.592772 z M 19.217725,39.030515 C 19.957035,38.634848 20.8,37.096982 20.8,36.143891 20.8,35.253504 18.826495,33.28 17.936109,33.28 c -0.953093,0 -2.490956,0.842966 -2.886623,1.582275 -1.40644,2.627955 1.540282,5.574679 4.168239,4.16824 z M 56.64,36.32 V 33.28 H 41.6 26.56 v 3.04 3.04 H 41.6 56.64 Z"/>
                </svg>                
                <span>{tableItem.name}</span>
            </td>,
            <td key={2}>{tableItem.description}</td>,
            <td key={3}>{tableItem.driveType}</td>	
	    ]
    }

    const itemRendererFiles = (item: TableItem) => {
        const tableItem = item as FileItem
        return [
            <td key={1}>
                <img src="http://localhost:3333/geticon?ext=."></img>
                <span>{tableItem.name}</span>
            </td>,
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
            type: path != "root" ?  "directory" : "root",
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
         
    return <Commander namespace={"test-commander"} theme={theme} getPathInfo={getPathInfo} getItems={getItems} />
}

