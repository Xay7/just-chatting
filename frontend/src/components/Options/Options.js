import React from 'react';
import styles from './Options.module.scss';


// Use with modal when need some input data in center of screen
const Options = (props) => {
    return (
        <div
            className={styles.Options}
            onClick={props.onclick}
        >{props.children}</div>
    )
}

export default Options;