import { Fragment } from 'react';

import classes from './app.module.css';
import AddReceipt from './components/expense/AddReceipt';

function App() {

  return (
    <Fragment>
      <div className={classes['flex-container']}>
        <AddReceipt></AddReceipt>
      </div>
    </Fragment>
  );
}

export default App;
