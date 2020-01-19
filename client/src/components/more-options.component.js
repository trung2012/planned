import React, { useRef, useLayoutEffect, useState } from 'react';

import './more-options.styles.scss';

const MoreOptions = ({ children, dismiss, className }) => {
  const [style, setStyle] = useState(null);
  const moreOptionsRef = useRef();
  const classNames = className ? `${className} more-options` : 'more-options'

  useLayoutEffect(() => {
    const { bottom } = moreOptionsRef.current.getBoundingClientRect();
    if (bottom > (window.innerHeight || document.documentElement.clientHeight)) {
      setStyle({
        top: '-5.75rem',
        animation: 'fadeFromBottom .2s cubic-bezier(0.1, 0.9, 0.2, 1)'
      })
    }
  }, [])

  return (
    <React.Fragment>
      <div
        className='overlay'
        onClick={event => {
          event.stopPropagation();
          dismiss();
        }}></div>
      <div
        className={classNames}
        onClick={event => {
          event.stopPropagation();
        }}
        ref={moreOptionsRef}
        style={style}
      >
        {children}
      </div>
    </React.Fragment>
  );
}

export default MoreOptions;