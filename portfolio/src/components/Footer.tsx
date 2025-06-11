const Footer = () => {
  return (
    <footer className="py-8 text-center text-tertiary">
      <div className="container-custom">
        <p>
          Designed & Built by{' '}
          <a
            href="https://github.com/username"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary hover:underline"
          >
            Your Name
          </a>
        </p>
        <p className="mt-2 text-sm">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer 