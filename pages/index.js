import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { useState, useEffect } from 'react'

const api = "https://6maydcc8u3.execute-api.ap-southeast-2.amazonaws.com"

function getFileUrl(e, filename) {
  e.preventDefault()
  fetch(`${api}/api/recipe/getFileUrl/${filename}`)
    .then((res) => res.text())
    .then((url) => {
      window.open(url, '_blank');
    })
}

export default function Home() {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(true)
  useEffect(() => {
    fetch(`${api}/api/recipe/list`)
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No profile data</p>

  return (
    <div className={styles.container}>
      <Head>
        <title>Pullyblank Recipe Directory</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>
          Pullyblank Recipe Book
        </h1>

        <p className={styles.description}>
          File Versions
        </p>
        <div>
          <ul>
            {data.map((item, index) => (
              <li key={index}>
                <Link href='' onClick={(e) => getFileUrl(e, item.Version)}>
                  <a>{item.Date}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <footer>
      </footer>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family:
            Menlo,
            Monaco,
            Lucida Console,
            Liberation Mono,
            DejaVu Sans Mono,
            Bitstream Vera Sans Mono,
            Courier New,
            monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
