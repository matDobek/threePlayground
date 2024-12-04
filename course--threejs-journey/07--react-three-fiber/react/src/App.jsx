import { useState, useMemo } from 'react'
import Clicker from './Clicker.jsx'
import People from './People.jsx'

export default function App({ children, clickerAmount }) {
  const [hasClicker, setHasClicker] = useState(true)
  const [globalCount, setGlobalCount] = useState(0)

  const buttonClick = () => {
    setHasClicker(b => !b)
    setGlobalCount(0)
  }

  const colors = useMemo(() => {
    const cs = [...Array(clickerAmount)].map(() => {
      return `hsl(${ Math.random() * 360}deg, 100%, 20%)`
    })

    return cs
  }, [clickerAmount])

  return <>
    { children }

    <div>
      Global count: { globalCount }
    </div>

    <button onClick={ buttonClick }>Toggle Clicker</button>
    { hasClicker &&
      <>
        {
          [...Array(clickerAmount)].map((_, index) =>
            <Clicker
              key={index}
              keyName={'clicker' + index}
              color={ colors[index] }
              setGlobalCount={setGlobalCount}
            />
          )
        }
      </>
    }

    <People />
  </>
}
