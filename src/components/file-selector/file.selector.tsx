import React, {memo, useCallback, useRef} from 'react';

import styles from './file.selector.module.scss';

type Props = {
  accept?: string;
  onSelect: (file?: File) => void;
};

const FileSelector: React.FC<Props> = ({
  onSelect,
  accept = 'application/json',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleClick = useCallback(() => inputRef.current?.click(), [inputRef]);
  const handleChange = useCallback(
    e => {
      onSelect(e.target.files?.[0]);
      e.target.value = null;
    },
    [onSelect]
  );

  return (
    <>
      <button className={styles.button} onClick={handleClick}>
        Load config
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className={styles.input}
        onChange={handleChange}
      ></input>
    </>
  );
};

export default memo(FileSelector);
