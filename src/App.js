import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


// import classes from './app.module.css';
import AddReceipt from './components/expense/AddReceipt';
import AllReceipts from './components/expense/AllReceipts';
import Layout from './components/layout/Layout';
import ScanReceipt from './components/expense/scanReceipts/ScanReceipts';

function App() {

  return (
    <BrowserRouter>
      <Layout>
          <Routes >
            <Route path='/' element={<Navigate to={'/scan-receipt'} replace />}/>
            <Route path='receipts' element={<AllReceipts />}/>
            <Route path='new-receipt' element={<AddReceipt />}/>
            <Route path='scan-receipt' element={<ScanReceipt />} />
          </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
