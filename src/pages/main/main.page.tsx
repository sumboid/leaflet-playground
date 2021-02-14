import React, {memo, useCallback} from 'react';
import {useDispatch} from 'react-redux';

import Map from 'components/map/map';
import FileSelector from 'components/file-selector/file.selector';
import {loadConfig} from 'domain/map/map.actions';

import styles from './main.page.module.scss';

const position = [51.505, -0.09] as [number, number];

const MainPage: React.FC = () => {
  const dispatch = useDispatch();
  const handleFileSelect = useCallback(
    (file?: File) => {
      if (file) {
        dispatch(loadConfig.request(file));
      }
    },
    [dispatch]
  );

  return (
    <div className={styles.root}>
      <Map position={position} />
      <div className={styles.loader}>
        <FileSelector onSelect={handleFileSelect} />
      </div>
    </div>
  );
};

export default memo(MainPage);
