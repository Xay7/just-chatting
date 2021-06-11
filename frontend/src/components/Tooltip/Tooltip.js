import React from 'react';
import styles from './Tooltip.module.scss';

const Tooltip = (props) => {
    return (
        <div style={{
            position: props.position,
            btop: props.wrapper === "Top" && 0,
            bottom: props.wrapper === "Bottom" && 0,
            left: props.wrapper === "Left" && 0,
            right: props.wrapper === "Right" && 0,
            width: props.width,
            height: props.height,
            margin: props.margin,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }} className={styles.TooltipWrapper}>
            <div style={{
                display: "none",
                position: "absolute",
                width: "max-content",
                borderRadius: "2px",
                backgroundColor: "black",
                color: "white",
                fontSize: "12px",
                padding: "5px",
                top: props.where === "Top" && props.distance,
                bottom: props.where === "Bottom" && props.distance,
                left: props.where === "Left" && props.distance,
                right: props.where === "Right" && props.distance,
                zIndex: 9999
            }} >{props.text}</div>
            {props.children}
        </div>
    )
}

export default Tooltip
