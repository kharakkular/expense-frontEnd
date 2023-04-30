import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


// import classes from './app.module.css';
import AddReceipt from './components/expense/AddReceipt';
import AllReceipts from './components/expense/AllReceipts';
import Layout from './components/layout/Layout';

function App() {

  return (
    <BrowserRouter>
      <Layout>
          <Routes >
            <Route path='/' element={<Navigate to={'/receipts'} replace />}/>
            <Route path='receipts' element={<AllReceipts />}/>
            <Route path='new-receipt' element={<AddReceipt />}/>
          </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
