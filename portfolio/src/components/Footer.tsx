const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 py-4 z-40">
      <div className="flex justify-center items-center">
        <p className="text-tertiary text-sm">
          Designed & Built by{' '}
          <a
            href="https://github.com/DicesDa"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary hover:text-secondary/80 transition-colors font-medium"
          >
            Jahye Ali
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer 