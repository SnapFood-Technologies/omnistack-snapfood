const Footer = () => {
    const currentYear = new Date().getFullYear()
  
    return (
      <footer className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 shadow-sm py-4">
        <div className="text-center text-sm text-muted-foreground">
          © {currentYear} SnapFood Technologies Inc. All rights reserved.
        </div>
      </footer>
    )
  }


  export default Footer;