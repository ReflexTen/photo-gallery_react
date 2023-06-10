import { useState, useEffect } from 'react'
import './App.scss'
import Collection from './components/Collection'

const navigation = [
  { name: 'Все' },
  { name: 'Море' },
  { name: 'Горы' },
  { name: 'Архитектура' },
  { name: 'Города' },
]

function App() {
  const [collection, setCollection] = useState([])
  const [categories, setCatecategories] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [sorting, setSorting] = useState(0)
  const [page, setPage] = useState(1)

  const [isLoading, setIsLoading] = useState(true)

  let quantityPhoto = 0
  let num = 0

  useEffect(() => {
    setIsLoading(true)

    const category = sorting ? `category=${sorting}` : ''

    fetch(
      `https://63f06e545b7cf4107e2027b9.mockapi.io/collection?page=${page}&${category}`
    )
      .then(res => res.json())
      .then(json => {
        quantityPhoto = json.length
        if (quantityPhoto > 3) {
          num = 2
        }

        if (quantityPhoto > 6) {
          num = 3
        }
        console.log(quantityPhoto)
        console.log(num)
      })

    fetch(
      `https://63f06e545b7cf4107e2027b9.mockapi.io/collection?page=${page}&limit=3&${category}`
    )
      .then(res => res.json())
      .then(json => {
        setCollection(json)
        // console.log(json.length)
      })
      .catch(err => alert(err))
      .finally(() => setIsLoading(false))
  }, [sorting, page])

  return (
    <div className="App">
      <h1>Моя коллекция фотографий</h1>
      <div className="container"></div>
      <div className="wrapper">
        <div className="top">
          <ul className="tags">
            {navigation.map((item, idx) => {
              return (
                <li
                  key={idx}
                  onClick={() => {
                    setCatecategories(idx)
                    setSorting(idx)
                  }}
                  className={categories === idx ? 'active' : ''}
                >
                  {item.name}
                </li>
              )
            })}
          </ul>
        </div>
        <div className="content">
          <input
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            className="search-input"
            placeholder="Поиск по названию..."
          />
          <div className="content__box">
            {isLoading ? (
              <div className="loading">Идет загрузка ...</div>
            ) : (
              collection
                .filter(obj => {
                  return obj.name
                    .toLowerCase()
                    .includes(searchValue.toLowerCase())
                })
                .map((obj, i) => {
                  return (
                    <Collection key={i} name={obj.name} images={obj.photos} />
                  )
                })
            )}
          </div>

          <ul className="pagination">
            {[...Array(num)].map((_, id) => {
              return (
                <li
                  key={id}
                  className={id + 1 === page ? 'active' : ''}
                  onClick={() => setPage(id + 1)}
                >
                  {id + 1}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
