import Image, { type ImageProps } from 'next/image'
import styles from './page.module.css'

type Props = Omit<ImageProps, 'src'> & {
  srcLight: string
  srcDark: string
}

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" alt="" />
      <Image {...rest} src={srcDark} className="imgDark" alt="" />
    </>
  )
}

const API_URL = process.env.VERCEL
  ? 'https://hono-turborepo-api-demo.vercel.app'
  : 'http://localhost:3000'

export default async function Home() {
  const result = await fetch(API_URL)
    .then((res) => res.text())
    .catch(() => 'Hello from Hono!')

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ThemeImage
          className={styles.logo}
          srcLight="turborepo-dark.svg"
          srcDark="turborepo-light.svg"
          alt="Turborepo logo"
          width={180}
          height={38}
          priority
        />
        <ol>
          <li>
            Get started by editing <code>apps/web/app/page.tsx</code>
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://next-leadcms-starter-production.up.railway.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir LeadCMS Panel
          </a>
          <a
            href="https://github.com/PavoAyala/template-de-web-y-admin-panel"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Ver Repositorio
          </a>
        </div>

        <div className={styles.result} style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
          <h3>Credenciales admin por defecto:</h3>
          <pre style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px' }}>
            {`URL: https://next-leadcms-starter-production.up.railway.app
Usuario: admin@yourdomain.com
Password: admin`}
          </pre>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com/templates?search=turborepo&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://turborepo.com?utm_source=create-turbo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to turborepo.com →
        </a>
      </footer>
    </div>
  )
}
