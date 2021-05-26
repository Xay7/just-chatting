import React from "react"
import styles from "./Footer.module.scss"
import GithubLogo from "../../assets/GitHub-Mark-Light-32px.png"

const Footer = () => {
    return (
        <div className={styles.Footer}>
            <a
                href="https://github.com/Xay7/just-chatting"
                target="_blank"
                rel="noopener noreferrer"
            >
                <img src={GithubLogo} alt="Github" className={styles.Github} />
            </a>
        </div>
    )
}

export default Footer
