import { useState, useEffect, useRef } from "react"

export default function Clicker({ keyName, color = "darkOrchid", setGlobalCount }) {
  const getLocalCount = () => parseInt( localStorage.getItem(keyName) ?? 0 )
  const [count, setCount] = useState( getLocalCount() )

  const button = useRef()

  useEffect(() => {
    setGlobalCount(c => c + count)

    button.current.style.backgroundColor = 'papayawhip'
    button.current.style.color = 'salmon'

    return () => {
      localStorage.removeItem(keyName)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(keyName, count)
  }, [count])

  const buttonClick = () => {
    setCount(count => count + 1)
    setGlobalCount(c => c + 1)
  }

  return <div>
    <button ref={ button } onClick={buttonClick}> Click Me! </button>
    <span style={ { color: color } }> clicked: { count } </span>
  </div>
}
