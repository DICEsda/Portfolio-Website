const Footer = () => {
  return (
    <footer className="bg-primary dark:bg-dark-primary py-4">
      <div className="container-custom text-center text-tertiary dark:text-dark-tertiary">
        <p>&copy; {new Date().getFullYear()} Jahye Ali. All rights reserved.</p>
        <p>Designed & Built by{' '}
          <a
            href="https://github.com/username"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary hover:animate-pulse"
          >
            Jahye Ali
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer 