import { useEffect, useState } from "react"

export default function People() {
  const [people, setPeople] = useState([])

  const getPeople = () => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        if(!response.ok) throw new Error('HTTP error')

        return response.json()
      })
      .then(data => setPeople(data) )
      .catch(err => { console.log(err) })
  }

  useEffect(() => {
    getPeople()
  }, [])

  return <div>
    <h2> People </h2>

    <ul>
      { people.map((v) => {
        return <li key={v.id}> {v.name} </li>
      }) }
    </ul>
  </div>
}
