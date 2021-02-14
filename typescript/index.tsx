import React from 'react'
// @ts-ignore
import styles from './styles.module.css'

type ExampleComponent = {
	text: string
}

export const ExampleComponent = ({ text }: ExampleComponent) => {
  	return <div className={styles.test}>Example Component: {text}</div>
}
