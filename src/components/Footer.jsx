const Footer = () => {
    return (
        <footer className="bg-[#750000] text-white py-4">
            <div className="container mx-auto text-center">
                <p className="text-sm">
                    Copyright © {new Date().getFullYear()} All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
