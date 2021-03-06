import React, { useLayoutEffect, useState} from 'react'
import { FolderTest } from './FolderTest'
import 'file-commander-control/dist/index.css'

const App = () => {
    const [appChoice, setAppChoice] = useState(0)
    const [theme, setTheme] = useState("")

    const onAppChange = (evt: React.ChangeEvent<HTMLSelectElement>) => setAppChoice(evt.target.selectedIndex)
    const onThemeChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
        switch (evt.target.selectedIndex) {
            case 0:
                changeTheme("blue")
                break
            case 1:
                changeTheme("yaru")
                break
            case 2:
                changeTheme("yarudark")
                break
        }
    }

    const changeTheme = (theme: string) => {
        const styleSheet = document.getElementById("theme")  
        const head = document.getElementsByTagName('head')[0]
        let link = document.createElement('link')
        link.rel = 'stylesheet'
        link.id = 'theme'
        link.type = 'text/css'
        link.href = `themes/${theme}.css`
        link.media = 'all'
        head.appendChild(link)
        if (styleSheet)
            styleSheet.remove()
        setTheme(theme)
    }

    useLayoutEffect(() => {
        changeTheme("blue")
    }, [])

    return (	
		<div>
			<div>
				<select onChange={onAppChange}>
					<option>Folder</option>
				</select>
				<select onChange={onThemeChange}>
                    <option>Blue</option>
                    <option>Yaru</option>
                    <option>Yaru dark</option>
				</select>
			</div>
			{appChoice == 0 
				? <FolderTest theme={theme} /> 
				: null}
		</div>  
	)
}

export default App
