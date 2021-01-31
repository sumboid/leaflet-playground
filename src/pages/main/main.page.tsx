import React, {memo} from 'react';

import Map from 'components/map/map';

import styles from './main.page.module.scss';

const position = [51.505, -0.09] as [number, number];

const MainPage: React.FC = () => {
  return (
    <div className={styles.root}>
      <Map position={position} />
    </div>
  );
};

export default memo(MainPage);
