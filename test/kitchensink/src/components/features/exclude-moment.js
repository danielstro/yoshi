import React from 'react';
import { en } from 'moment';
import de from 'moment/locale/de';

export default () => (
  <div>
    <div id="exclude-moment">
      <div id="en">{en}</div>
      <div id="de">{de}</div>
    </div>
  </div>
);
