const PrivacyPolicy = () => {
    return (
        <div className="center-section">
            <div style={{textAlign: "left", maxWidth: 800}}>
                <h1>Privacy Policy</h1>
                <p>Helf ("we", "us", or "our") values your privacy. This Privacy Policy explains how we collect, use, 
                    and protect your personal information when you use our web application.</p>
                <p style={{borderBottom: "2px solid var(--grey-color)"}}>
                    We collect <span style={{fontWeight: "bold"}}>email address</span> to:
                    <ul>
                        <li>Authenticate you during Log-In <span style={{fontWeight: "bold"}}>to provide an access to app features</span></li>
                        <li>Communicate essential service-related updates if necessary.</li>
                        <li>Promote our new products.</li>
                        <li>Collect feedback about existing services and products.</li>
                    </ul>
                </p>
                <p style={{borderBottom: "2px solid var(--grey-color)"}}>
                    <ul>
                        <li>We <span style={{fontWeight: "bold"}}>do not sell, trade, or rent</span> your personal data to third parties.</li>
                        <li>We do not use any third-party analytics or tracking tools.</li>
                        <li>We protect your data by using encryption in transit and at rest (passwords).</li>
                        <li>We do not use cookies or tracking technologies.</li>
                    </ul>
                </p>
                <p>
                    As a user in the European Union (EU), you have the right to:
                    <ul>
                        <li>Access, update, or delete your personal data</li>
                        <li>Request data portability</li>
                        <li>Object to processing</li>
                    </ul>
                    To exercise these rights, contact us at: <a href="mailto: while.no.helf@gmail.com" target="_blank">while.no.helf@gmail.com</a>
                </p>
            </div>
        </div>
    )
}

export default PrivacyPolicy;