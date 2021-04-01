import React from 'react'
import _ from 'lodash'
import { Commander, Column, PathInfo, FolderTableItem, TableItem  } from 'file-commander-control'

type DriveItem = {
    name: string,
    description: string,
    driveType: string
}

type FileItem = {
    name: string,
    time: Date,
    size: number,
    isDirectory: boolean
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
                { 
                tableItem.isDirectory ?
                    <svg className="svg" viewBox="0 0 1600 1600">
                        <path className="path" d="M 233.82369,1371.7235 C 142.86653,1363.9041 76.893745,1273.6489 88.471385,1186.1738 88.725189,878.60148 86.478209,570.93784 90.1772,263.42085 103.1198,176.20618 192.96815,117.12319 279.57048,127.95809 c 94.86457,2.08486 190.64811,-5.67983 284.97182,4.30185 72.81507,15.81931 127.5668,84.58276 127.55779,157.93224 226.79955,0.66551 453.79181,-0.60344 680.47101,1.27009 89.0887,10.85174 153.416,98.45583 141.9829,185.1704 0.601,249.12184 1.1249,498.2542 -0.4428,747.37123 -5.107,90.6798 -96.2513,159.9695 -186.2129,148.1059 -364.68965,0.5778 -729.38836,1.0611 -1094.07461,-0.3863 z M 1361.5894,1263.2986 c 44.4976,-8.42 46.5224,-54.0812 43.4627,-88.8588 -0.7473,-245.14763 1.8126,-490.38804 -1.661,-735.46491 -10.2423,-42.2289 -54.8891,-42.78353 -89.3332,-40.24177 -357.21072,0 -714.42148,0 -1071.63223,0 -65.54009,18.1395 -38.72153,96.98298 -44.67661,145.98103 -0.071,225.23903 0.21972,450.47812 0.30847,675.71715 26.96503,71.7946 119.03872,34.6939 178.20156,44.0088 328.4356,-0.426 656.92461,1.5407 985.33031,-1.1415 z" />
                    </svg>                
                :
                    <svg className="svg" viewBox="0 0 72 72">
                        <path className="path" d="M 9.0948483,47.713174 C 7.5739523,47.022416 6.5386022,45.82351 6.0580771,44.196672 5.8448112,43.474653 5.7546758,40.255072 5.8182131,35.628902 L 5.92,28.217804 6.9139274,26.988902 C 7.4605872,26.313006 8.3965872,25.472 8.9939274,25.12 10.055591,24.494384 10.655357,24.48 35.68,24.48 c 25.024643,0 25.62441,0.01438 26.686074,0.64 0.597337,0.352 1.533337,1.193006 2.08,1.868902 l 0.993926,1.228902 0.101786,7.411098 c 0.06354,4.62617 -0.02659,7.845751 -0.239863,8.56777 -0.480525,1.626838 -1.515875,2.825744 -3.036771,3.516502 -1.235226,0.561012 -2.659603,0.592772 -26.585152,0.592772 -23.925549,0 -25.349927,-0.03174 -26.5851517,-0.592772 z M 19.217725,39.030515 C 19.957035,38.634848 20.8,37.096982 20.8,36.143891 20.8,35.253504 18.826495,33.28 17.936109,33.28 c -0.953093,0 -2.490956,0.842966 -2.886623,1.582275 -1.40644,2.627955 1.540282,5.574679 4.168239,4.16824 z M 56.64,36.32 V 33.28 H 41.6 26.56 v 3.04 3.04 H 41.6 56.64 Z"/>
                    </svg>                
                    // <img src="http://localhost:3333/geticon?ext=."></img>
                }
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
            const items = await res.json() as FileItem[]
            return _.orderBy(items, ['isDirectory', 'name'], ['desc', 'asc'])
            
            // isDirectory: true
            // isHidden: false
            // name: "Bücher"
            // size: 4096
            // time: "2021-02-19T17:43:56.000Z"            
        }
    }
         
    return <Commander namespace={"test-commander"} theme={theme} getPathInfo={getPathInfo} getItems={getItems} />
}

