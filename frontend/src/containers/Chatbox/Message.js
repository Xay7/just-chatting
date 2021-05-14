import React from 'react';
import styles from './Chatbox.module.scss';
import moment from 'moment';

const Message = (props) => {
  const isUrl = (string) => {
    const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\\/]))?/;
    return regexp.test(string);
  };

  const isImage = (string) => {
    const regexp = /\.(gif|jpg|jpeg|tiff|png)$/i;
    return regexp.test(string);
  };

  const adjustImage = ({ target: img }) => {
    img.style.marginLeft = '62px';
    img.style.marginBottom = '5px';
    if (img.naturalHeight > 512 || img.naturalWidth > 512) {
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
    }
  };
  if (props.index > 0) {
    if (isUrl(props.message) === true) {
      if (isImage(props.message) === true) {
        return (
          <div className={styles.Messages} key={props.created}>
            <a href={props.message} target="_blank" rel="noopener noreferrer">
              <img src={props.message} alt={props.message} onLoad={adjustImage} />
            </a>
          </div>
        );
      } else
        return (
          <a href={props.message} target="_blank" rel="noopener noreferrer" className={styles.Link} key={props.index}>
            {props.message}
          </a>
        );
    }
    // CHECK FOR SAME AUTHOR AND IF THERE IS LESS THAN 30 MINUTES TIME DIFFERENCE BETWEEN LAST MESSAGE
    if (props.previousMessage !== null) {
      if (props.author.name === props.previousMessage.author.name && moment(props.created).diff(moment(props.previousMessage.created_at), 'minutes') < 30) {
        return (
          <div className={styles.Messages} key={props.created}>
            <div className={styles.Message}>{props.message}</div>
          </div>
        );
      } else {
        return (
          <div className={styles.Messages} key={props.created}>
            <hr className={styles.MessageHorizontalLine}></hr>
            <div className={styles.MessageHeader}>
              <img src={props.author.avatar} alt={props.author.name + ' avatar'} className={styles.Avatar} />
              <p className={styles.Username}>{props.author.name}</p>
              <p className={styles.Date}>{moment(props.created).calendar(null)}</p>
            </div>
            <div className={styles.Message}>{props.message}</div>
          </div>
        );
      }
    } else {
      return (
        <div className={styles.Messages} key={props.created}>
          <hr className={styles.MessageHorizontalLine}></hr>
          <div className={styles.MessageHeader}>
            <img src={props.author.avatar} alt={props.author.name + ' avatar'} className={styles.Avatar} />
            <p className={styles.Username}>{props.author.name}</p>
            <p className={styles.Date}>{moment(props.created_at).calendar(null)}</p>
          </div>
          <div className={styles.Message}>{props.message}</div>
        </div>
      );
    }
  } else {
    return (
      <div className={styles.Messages} key={props.created}>
        <hr className={styles.MessageHorizontalLine}></hr>
        <div className={styles.MessageHeader}>
          <img src={props.author.avatar} alt={props.author.name + ' avatar'} className={styles.Avatar} />
          <p className={styles.Username}>{props.author.name}</p>
          <p className={styles.Date}>{moment(props.created_at).calendar(null)}</p>
        </div>
        <div className={styles.Message}>{props.message}</div>
      </div>
    );
  }
};

export default Message;
